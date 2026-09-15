"""Impact Analyzer — searches the repository for references to affected
endpoints, models and fields. Pure deterministic text/AST-free heuristics.
"""
import os
from typing import Any


def _iter_py_files(repo_path: str) -> list[str]:
    files: list[str] = []
    for root, _dirs, fnames in os.walk(repo_path):
        for f in fnames:
            if f.endswith((".py", ".ts", ".tsx", ".js", ".jsx", ".md")):
                files.append(os.path.join(root, f))
    return files


def analyze(change: dict, repo_path: str) -> list[dict]:
    """Return affected files for a single change with the reason each file matched."""
    results: list[dict] = []
    seen: set[str] = set()

    terms: list[tuple[str, str]] = []  # (term, reason)

    path = change.get("path") or ""
    field_before = ((change.get("before_data") or {}).get("field")) if isinstance(change.get("before_data"), dict) else None
    field_after = ((change.get("after_data") or {}).get("field")) if isinstance(change.get("after_data"), dict) else None
    model = None
    for blob in (change.get("before_data"), change.get("after_data")):
        if isinstance(blob, dict) and blob.get("model"):
            model = blob["model"]

    if change.get("change_type") == "removed_endpoint":
        terms.append((path, f"references removed endpoint {change.get('method')} {path}"))
    elif change.get("change_type") == "added_endpoint":
        terms.append((path, f"may integrate new endpoint {change.get('method')} {path}"))
    else:
        if path and path != "/":
            segments = [s for s in path.split("/") if s and not s.startswith("{")]
            for seg in segments[:2]:
                terms.append((f"/{path.lstrip('/')}", f"references endpoint path {path}"))
                terms.append((seg, f"references endpoint path segment '{seg}'"))
    if field_before:
        terms.append((field_before, f"uses field '{field_before}' which is affected by this change"))
    if field_after:
        terms.append((field_after, f"uses field '{field_after}' introduced by this change"))
    if model:
        terms.append((model, f"references model '{model}'"))

    # Ignore trivially generic terms that would match everything
    stop_terms = {"string", "integer", "id", "name", "data", "item", "items"}

    for file_path in _iter_py_files(repo_path):
        rel = os.path.relpath(file_path, repo_path).replace("\\", "/")
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as fh:
                content = fh.read()
        except OSError:
            continue
        reasons: list[str] = []
        for term, reason in terms:
            if not term or len(term) < 3 or term in stop_terms:
                continue
            if term in content:
                if reason not in reasons:
                    reasons.append(reason)
        if reasons:
            if rel not in seen:
                seen.add(rel)
                results.append({"file_path": rel, "reason": "; ".join(reasons[:3])})
    return results
