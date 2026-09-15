"""AI Analyzer — LLM provider abstraction.

Uses an OpenAI-compatible chat completion endpoint when LLM_API_KEY is set.
If no key is configured (or the call fails), falls back to a deterministic
template-based explanation so the product always works.
"""
import json
import os
import urllib.request

PROVIDERS = {
    "openai": "https://api.openai.com/v1/chat/completions",
    "openrouter": "https://openrouter.ai/api/v1/chat/completions",
    "groq": "https://api.groq.com/openai/v1/chat/completions",
}


def get_provider() -> tuple:
    key = os.environ.get("LLM_API_KEY") or os.environ.get("OPENAI_API_KEY")
    provider = os.environ.get("LLM_PROVIDER", "openai").lower()
    model = os.environ.get("LLM_MODEL", "gpt-4o-mini")
    if provider not in PROVIDERS:
        provider = "openai"
    return (key, model) if key else (None, model)


def _fallback(change: dict) -> dict:
    ctype = change.get("change_type", "")
    path = f"{change.get('method')} {change.get('path')}"
    before = change.get("before_data") or {}
    after = change.get("after_data") or {}

    if ctype == "response_field_renamed":
        explanation = (f"The response field '{before.get('field')}' of {path} was renamed to "
                       f"'{after.get('field')}'. Existing clients expecting '{before.get('field')}' may fail "
                       f"and should be updated before deployment.")
        risk = "HIGH — response contract changed; client deserialization may break."
        recommendation = (f"Update all clients to use '{after.get('field')}', or keep '{before.get('field')}' "
                          f"as a deprecated alias during a transition window.")
    elif ctype == "removed_endpoint":
        explanation = (f"The endpoint {path} was removed. Any client still calling it will receive errors "
                       f"once this version is deployed.")
        risk = "HIGH — endpoint no longer exists; direct client breakage."
        recommendation = "Confirm no production traffic uses this endpoint, then remove client calls and publish the deprecation date."
    elif ctype == "added_endpoint":
        explanation = f"A new endpoint {path} was added. This is additive and does not affect existing clients."
        risk = "LOW — purely additive change."
        recommendation = "Publish the new endpoint in the changelog and update generated documentation."
    elif ctype == "param_removed":
        removed = before.get("param") or before.get("name") or "a parameter"
        explanation = (f"Parameter '{removed}' was removed from {path}. Clients sending this parameter "
                       f"will receive validation errors or lose functionality.")
        risk = "HIGH" if change.get("severity") == "BREAKING" else "MEDIUM — optional parameter removed."
        recommendation = "Keep the parameter as deprecated and ignored, or coordinate client updates before release."
    elif ctype == "param_added":
        added = (after or {}).get("name") or (after or {}).get("param") or "a parameter"
        explanation = (f"Parameter '{added}' was added to {path}. Existing clients are unaffected "
                       f"if the parameter is optional.")
        risk = "LOW" if not (after or {}).get("required") else "MEDIUM — new required parameter."
        recommendation = "Document the new parameter; make it optional with a default if possible."
    elif ctype == "param_type_changed":
        explanation = (f"Parameter '{(after or {}).get('name')}' type changed from "
                       f"'{before.get('type')}' to '{after.get('type')}' at {path}.")
        risk = "MEDIUM — type mismatch can cause validation errors for clients."
        recommendation = "Verify client payloads match the new type; add server-side coercion if needed."
    elif ctype.startswith("response_field_added"):
        explanation = (f"Response field '{(after or {}).get('field')}' was added to {path}. "
                       f"Existing clients that ignore unknown fields are unaffected.")
        risk = "LOW — additive response change."
        recommendation = "Document the new response field in the changelog."
    elif ctype.startswith("request"):
        explanation = f"The request schema of {path} changed: {change.get('description')}"
        risk = "MEDIUM" if change.get("severity") != "BREAKING" else "HIGH"
        recommendation = "Update client request payloads and validation before deployment."
    else:
        explanation = change.get("description", "API change detected.")
        risk = {"BREAKING": "HIGH", "WARNING": "MEDIUM"}.get(change.get("severity", ""), "LOW")
        recommendation = "Review the change and update affected clients and documentation."

    return {
        "explanation": explanation,
        "risk_assessment": risk,
        "recommendation": recommendation,
        "source": "deterministic",
    }


def _build_prompt(change: dict) -> str:
    return (
        "You are an API documentation analyst. A change was detected in a FastAPI backend.\n"
        f"Endpoint: {change.get('method')} {change.get('path')}\n"
        f"Change type: {change.get('change_type')}\n"
        f"Severity: {change.get('severity')}\n"
        f"Description: {change.get('description')}\n"
        f"Before: {json.dumps(change.get('before_data') or {})}\n"
        f"After: {json.dumps(change.get('after_data') or {})}\n"
        f"Affected files: {', '.join(f['file_path'] for f in change.get('affected_files', []))}\n\n"
        "Return JSON with keys: explanation (human-readable, mention client impact), "
        "risk_assessment (one short sentence), recommendation (concrete next step)."
    )


def analyze_change(change: dict) -> dict:
    """Analyze one change. Uses the LLM when configured, else deterministic fallback."""
    key, model = get_provider()
    fallback = _fallback(change)
    if not key:
        return fallback
    provider = os.environ.get("LLM_PROVIDER", "openai").lower()
    url = PROVIDERS.get(provider, PROVIDERS["openai"])
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You analyze API changes for breaking changes. Reply only with valid JSON."},
            {"role": "user", "content": _build_prompt(change)},
        ],
        "temperature": 0.2,
    }
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"},
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        content = data["choices"][0]["message"]["content"]
        content = content[content.index("{"): content.rindex("}") + 1]
        parsed = json.loads(content)
        return {
            "explanation": parsed.get("explanation") or fallback["explanation"],
            "risk_assessment": parsed.get("risk_assessment") or fallback["risk_assessment"],
            "recommendation": parsed.get("recommendation") or fallback["recommendation"],
            "source": f"llm:{model}",
        }
    except Exception:
        return fallback


def generate_changelog(changes: list[dict], repo_name: str, analyzed: list[dict]) -> str:
    """Deterministic changelog generation."""
    if not changes:
        return f"# Changelog — {repo_name}\n\nNo API changes detected. Documentation is up to date."
    lines = [f"# Changelog — {repo_name}", ""]
    groups: dict[str, list] = {"BREAKING": [], "WARNING": [], "SAFE": []}
    for change, analysis in zip(changes, analyzed):
        groups.setdefault(change.get("severity", "SAFE"), []).append((change, analysis))
    if groups["BREAKING"]:
        lines.append("## Breaking Changes")
        for change, analysis in groups["BREAKING"]:
            before = (change.get("before_data") or {}).get("field")
            after = (change.get("after_data") or {}).get("field")
            arrow = f" (`{before}` → `{after}`)" if before and after else ""
            lines.append(f"- **{change.get('method')} {change.get('path')}** — {change.get('description')}{arrow}")
            if analysis.get("recommendation"):
                lines.append(f"  - _Recommended:_ {analysis['recommendation']}")
        lines.append("")
    if groups["WARNING"]:
        lines.append("## Warnings")
        for change, _a in groups["WARNING"]:
            lines.append(f"- **{change.get('method')} {change.get('path')}** — {change.get('description')}")
        lines.append("")
    if groups["SAFE"]:
        lines.append("## Safe Changes")
        for change, _a in groups["SAFE"]:
            lines.append(f"- **{change.get('method')} {change.get('path')}** — {change.get('description')}")
        lines.append("")
    return "\n".join(lines)
