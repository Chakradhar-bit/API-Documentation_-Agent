"""API Change Detector — compares two extracted endpoint snapshots.

Classifies every difference as SAFE, WARNING or BREAKING without any AI.
"""
from typing import Optional

SAFE = "SAFE"
WARNING = "WARNING"
BREAKING = "BREAKING"


def key_of(ep: dict) -> tuple[str, str]:
    return (ep["method"].upper(), ep["path"])


def _fields_of(schema: Optional[dict]) -> dict:
    if not schema:
        return {}
    return schema.get("fields") or {}


def _detect_schema_changes(before_schema: Optional[dict], after_schema: Optional[dict],
                           schema_kind: str) -> list[dict]:
    """Diff request/response model fields between two schema dicts."""
    changes: list[dict] = []
    before_fields, after_fields = _fields_of(before_schema), _fields_of(after_schema)
    if not before_fields and not after_fields:
        return changes
    model_name = (before_schema or after_schema or {}).get("model") or "model"

    added = [f for f in after_fields if f not in before_fields]
    removed = [f for f in before_fields if f not in after_fields]
    type_changed = [f for f in set(before_fields) & set(after_fields) if before_fields[f] != after_fields[f]]

    for f in removed:
        renamed_to = _find_rename(f, added)
        if renamed_to:
            changes.append({
                "change_type": "response_field_renamed" if schema_kind == "response" else "request_field_renamed",
                "severity": BREAKING,
                "description": f"Field '{f}' was renamed to '{renamed_to}' in {schema_kind} model '{model_name}'",
                "before_data": {"field": f, "type": before_fields[f], "model": model_name},
                "after_data": {"field": renamed_to, "type": after_fields[renamed_to], "model": model_name},
            })
            added.remove(renamed_to)
        else:
            changes.append({
                "change_type": "response_field_removed" if schema_kind == "response" else "request_field_removed",
                "severity": BREAKING,
                "description": f"Field '{f}' was removed from {schema_kind} model '{model_name}'",
                "before_data": {"field": f, "type": before_fields[f], "model": model_name},
                "after_data": {"field": None, "type": None, "model": model_name},
            })
    for f in added:
        changes.append({
            "change_type": f"{schema_kind}_field_added",
            "severity": SAFE if schema_kind == "request" else WARNING,
            "description": f"Field '{f}' ({after_fields[f]}) was added to {schema_kind} model '{model_name}'",
            "before_data": {"field": None, "type": None, "model": model_name},
            "after_data": {"field": f, "type": after_fields[f], "model": model_name},
        })
    for f in type_changed:
        changes.append({
            "change_type": f"{schema_kind}_field_type_changed",
            "severity": BREAKING,
            "description": f"Field '{f}' type changed from '{before_fields[f]}' to '{after_fields[f]}' in {schema_kind} model '{model_name}'",
            "before_data": {"field": f, "type": before_fields[f], "model": model_name},
            "after_data": {"field": f, "type": after_fields[f], "model": model_name},
        })
    return changes


def _find_rename(removed_field: str, added_fields: list[str]) -> Optional[str]:
    """Heuristic: a removed field 'renames' to an added field when one contains
    the other (e.g. name → full_name) or they share a long common substring."""
    # 1) Direct containment (name ⊂ full_name)
    for candidate in added_fields:
        if len(removed_field) >= 3 and removed_field in candidate:
            return candidate
        if len(candidate) >= 3 and candidate in removed_field:
            return candidate
    # 2) Longest common substring similarity
    best, best_score = None, 0.0
    for candidate in added_fields:
        common = _longest_common_substring(removed_field, candidate)
        score = len(common) / max(len(removed_field), len(candidate))
        if score > best_score:
            best, best_score = candidate, score
    return best if best_score >= 0.5 else None


def _longest_common_substring(a: str, b: str) -> str:
    if not a or not b:
        return ""
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    longest, end = 0, 0
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
                if dp[i][j] > longest:
                    longest, end = dp[i][j], i
    return a[end - longest:end]


def diff_params(before_params: list[dict], after_params: list[dict]) -> list[dict]:
    changes: list[dict] = []
    before_by_name = {p["name"]: p for p in before_params}
    after_by_name = {p["name"]: p for p in after_params}

    for name, after in after_by_name.items():
        if name not in before_by_name:
            risky = bool(after.get("required"))
            changes.append({
                "change_type": "param_added",
                "severity": WARNING if risky else SAFE,
                "description": f"Parameter '{name}' ({after.get('in')}, {after.get('type')}) added"
                + (" and is required" if risky else ""),
                "before_data": {"param": None},
                "after_data": after,
            })
    for name, before in before_by_name.items():
        if name not in after_by_name:
            required = bool(before.get("required"))
            changes.append({
                "change_type": "param_removed",
                "severity": BREAKING if required else WARNING,
                "description": (f"Required parameter '{name}' ({before.get('in')}, {before.get('type')}) removed"
                                if required else f"Optional parameter '{name}' ({before.get('in')}) removed"),
                "before_data": before,
                "after_data": {"param": None},
            })
    for name in set(before_by_name) & set(after_by_name):
        before, after = before_by_name[name], after_by_name[name]
        if before.get("type") != after.get("type"):
            changes.append({
                "change_type": "param_type_changed",
                "severity": BREAKING if before.get("in") == "path" else WARNING,
                "description": f"Parameter '{name}' type changed from '{before.get('type')}' to '{after.get('type')}'",
                "before_data": before,
                "after_data": after,
            })
    return changes


def _attach(before: dict, after: dict, changes: list[dict]) -> list[dict]:
    for c in changes:
        c.setdefault("method", before["method"])
        c.setdefault("path", before["path"])
    return changes


def detect_changes(old_endpoints: list[dict], new_endpoints: list[dict]) -> list[dict]:
    """Compare snapshots and return the full list of detected changes."""
    changes: list[dict] = []
    old_map = {key_of(e): e for e in old_endpoints}
    new_map = {key_of(e): e for e in new_endpoints}

    for key, ep in new_map.items():
        if key not in old_map:
            changes.append({
                "method": ep["method"], "path": ep["path"],
                "change_type": "added_endpoint", "severity": SAFE,
                "description": f"New endpoint {ep['method']} {ep['path']} added",
                "before_data": None, "after_data": ep,
            })
    for key, ep in old_map.items():
        if key not in new_map:
            # If the same path still exists with a different method, classify
            # as an HTTP method change rather than a plain removal.
            path_still_exists = any(p == ep["path"] for (m, p) in new_map)
            if path_still_exists:
                new_method = next(m for (m, p) in new_map if p == ep["path"])
                changes.append({
                    "method": ep["method"], "path": ep["path"],
                    "change_type": "method_changed", "severity": BREAKING,
                    "description": f"HTTP method changed: {ep['method']} {ep['path']} → {new_method} {ep['path']}",
                    "before_data": ep, "after_data": new_map[(new_method, ep["path"])],
                })
            else:
                changes.append({
                    "method": ep["method"], "path": ep["path"],
                    "change_type": "removed_endpoint", "severity": BREAKING,
                    "description": f"Endpoint {ep['method']} {ep['path']} was removed — existing clients will receive errors",
                    "before_data": ep, "after_data": None,
                })

    for key in set(old_map) & set(new_map):
        before, after = old_map[key], new_map[key]
        method, path = key

        changes.extend(_attach(before, after, diff_params(before.get("params") or [], after.get("params") or [])))
        changes.extend(_attach(before, after, _detect_schema_changes(
            before.get("request_schema"), after.get("request_schema"), "request")))
        changes.extend(_attach(before, after, _detect_schema_changes(
            before.get("response_schema"), after.get("response_schema"), "response")))

        if (before.get("status_codes") or [200]) != (after.get("status_codes") or [200]):
            changes.extend(_attach(before, after, [{
                "change_type": "status_code_changed", "severity": WARNING,
                "description": f"Status code changed from {before.get('status_codes')} to {after.get('status_codes')}",
                "before_data": {"status_codes": before.get("status_codes")},
                "after_data": {"status_codes": after.get("status_codes")},
            }]))

        before_auth, after_auth = before.get("auth"), after.get("auth")
        if before_auth != after_auth:
            changes.extend(_attach(before, after, [{
                "change_type": "auth_changed",
                "severity": BREAKING if before_auth and not after_auth else WARNING,
                "description": f"Authentication changed: '{before_auth or 'none'}' → '{after_auth or 'none'}'",
                "before_data": {"auth": before_auth},
                "after_data": {"auth": after_auth},
            }]))

    severity_rank = {BREAKING: 0, WARNING: 1, SAFE: 2}
    changes.sort(key=lambda c: (c["path"], severity_rank.get(c["severity"], 3)))
    return changes


def summarize(changes: list[dict]) -> dict:
    return {
        "total": len(changes),
        "breaking": sum(1 for c in changes if c["severity"] == BREAKING),
        "warnings": sum(1 for c in changes if c["severity"] == WARNING),
        "safe": sum(1 for c in changes if c["severity"] == SAFE),
    }
