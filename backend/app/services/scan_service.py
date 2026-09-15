"""Scan Service — orchestrates the full pipeline:

repository_scanner → api_extractor → change_detector → impact_analyzer
→ openapi_generator → ai_analyzer → database persistence.
"""
import json
import os
from datetime import datetime, timezone

from ..database import db
from . import api_extractor, change_detector, impact_analyzer, openapi_generator, ai_analyzer

# Resolved repo paths for local/demo scanning
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEMO_ROOT = os.path.abspath(os.path.join(BASE_DIR, "..", "demo"))


def utcnow() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


def get_or_create_repo(name: str, url: str | None = None) -> dict:
    rows = db.query("SELECT * FROM repositories WHERE name = ?", (name,))
    if rows:
        return rows[0]
    repo_id = db.execute("INSERT INTO repositories (name, url, status) VALUES (?, ?, 'connected')", (name, url))
    return db.query("SELECT * FROM repositories WHERE id = ?", (repo_id,))[0]


def _save_endpoints(repo_id: int, endpoints: list[dict]) -> None:
    db.execute("DELETE FROM endpoints WHERE repo_id = ?", (repo_id,))
    for ep in endpoints:
        db.execute(
            """INSERT INTO endpoints (repo_id, method, path, summary, description, params,
               request_schema, response_schema, status_codes, auth, source_file)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (repo_id, ep["method"], ep["path"], ep.get("summary"), ep.get("description"),
             json.dumps(ep.get("params") or []),
             json.dumps(ep.get("request_schema")) if ep.get("request_schema") else None,
             json.dumps(ep.get("response_schema")) if ep.get("response_schema") else None,
             json.dumps(ep.get("status_codes") or [200]), ep.get("auth"), ep.get("source_file")),
        )


def _latest_snapshot(repo_id: int) -> dict | None:
    rows = db.query(
        "SELECT * FROM snapshots WHERE repo_id = ? ORDER BY version DESC, id DESC LIMIT 1", (repo_id,))
    if not rows:
        return None
    return db.loads(rows[0]["payload"], [])


def run_scan(repo_name: str, repo_path: str, source: str = "manual",
             url: str | None = None) -> dict:
    """Run the complete analysis pipeline for one repository version."""
    if not os.path.isdir(repo_path):
        raise FileNotFoundError(f"Repository path not found: {repo_path}")

    repo = get_or_create_repo(repo_name, url)
    repo_id = repo["id"]

    new_endpoints = api_extractor.scan_repo(repo_path)
    if not new_endpoints:
        raise ValueError(f"No API routes detected in {repo_path}. Is this a FastAPI repository?")

    old_endpoints = _latest_snapshot(repo_id) or []
    detected = change_detector.detect_changes(old_endpoints, new_endpoints)

    # Persist scan record
    scan_id = db.execute(
        """INSERT INTO scans (repo_id, source, status, message, endpoints_count, changes_count, breaking_count)
           VALUES (?, ?, 'completed', ?, ?, ?, ?)""",
        (repo_id, source, f"Scanned {len(new_endpoints)} endpoints from {repo_path}",
         len(new_endpoints), len(detected),
         sum(1 for c in detected if c["severity"] == change_detector.BREAKING)))

    # Persist new snapshot
    next_version = db.query("SELECT COALESCE(MAX(version), 0) + 1 AS v FROM snapshots WHERE repo_id = ?", (repo_id,))[0]["v"]
    db.execute("INSERT INTO snapshots (repo_id, payload, version) VALUES (?, ?, ?)",
               (repo_id, json.dumps(new_endpoints), next_version))

    # Persist endpoints (current state)
    _save_endpoints(repo_id, new_endpoints)

    # Per-change: impact analysis + AI analysis + persistence
    analyzed_summaries = []
    change_rows = []
    for change in detected:
        affected = impact_analyzer.analyze(change, repo_path)
        change["affected_files"] = affected
        analysis = ai_analyzer.analyze_change(change)

        change_id = db.execute(
            """INSERT INTO changes (repo_id, scan_id, method, path, change_type, severity,
               description, before_data, after_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (repo_id, scan_id, change["method"], change["path"], change["change_type"],
             change["severity"], change["description"],
             json.dumps(change.get("before_data")), json.dumps(change.get("after_data"))))
        for f in affected:
            db.execute("INSERT INTO affected_files (change_id, file_path, reason) VALUES (?, ?, ?)",
                       (change_id, f["file_path"], f["reason"]))
        db.execute(
            "INSERT INTO analysis (change_id, explanation, risk_assessment, recommendation, source) VALUES (?, ?, ?, ?, ?)",
            (change_id, analysis["explanation"], analysis["risk_assessment"],
             analysis["recommendation"], analysis["source"]))
        change["id"] = change_id
        change_rows.append(change)
        analyzed_summaries.append(analysis)

    changelog = ai_analyzer.generate_changelog(detected, repo_name, analyzed_summaries)
    db.execute("INSERT INTO changelogs (repo_id, scan_id, content) VALUES (?, ?, ?)",
               (repo_id, scan_id, changelog))

    last_change_ts = utcnow() if detected else repo["last_change"]
    db.execute("UPDATE repositories SET last_scan = ?, last_change = ? WHERE id = ?",
               (utcnow(), last_change_ts, repo_id))

    return {
        "scan_id": scan_id,
        "repo_id": repo_id,
        "endpoints_count": len(new_endpoints),
        "changes_count": len(detected),
        "breaking_count": sum(1 for c in detected if c["severity"] == change_detector.BREAKING),
        "changes": change_rows,
        "changelog": changelog,
        "status": "completed",
        "message": f"{len(new_endpoints)} endpoints scanned, {len(detected)} changes detected",
    }


def run_demo() -> dict:
    """Demo workflow: baseline scan of version1, then change scan of version2.

    Resets the demo repository state so the demo is repeatable.
    """
    v1 = os.path.join(DEMO_ROOT, "version1")
    v2 = os.path.join(DEMO_ROOT, "version2")
    if not os.path.isdir(v1) or not os.path.isdir(v2):
        raise FileNotFoundError("Demo repositories are missing (demo/version1, demo/version2)")

    # Fresh demo state each run
    repo_rows = db.query("SELECT id FROM repositories WHERE name = 'demo-fastapi'")
    if repo_rows:
        repo_id = repo_rows[0]["id"]
        db.execute("DELETE FROM affected_files WHERE change_id IN (SELECT id FROM changes WHERE repo_id = ?)", (repo_id,))
        db.execute("DELETE FROM analysis WHERE change_id IN (SELECT id FROM changes WHERE repo_id = ?)", (repo_id,))
        for table in ("snapshots", "endpoints", "changes", "changelogs"):
            db.execute(f"DELETE FROM {table} WHERE repo_id = ?", (repo_id,))
        for s in db.query("SELECT id FROM scans WHERE repo_id = ?", (repo_id,)):
            db.execute("DELETE FROM scans WHERE id = ?", (s["id"],))

    baseline = run_scan("demo-fastapi", v1, source="demo-baseline")
    result = run_scan("demo-fastapi", v2, source="demo")
    result["baseline_endpoints"] = baseline["endpoints_count"]
    return result


def get_dashboard() -> dict:
    # Prefer the most recently active repository
    rows = db.query("SELECT * FROM repositories ORDER BY last_scan DESC, id LIMIT 1")
    if not rows:
        return {
            "stats": {"repository": "none", "endpoints": 0, "synchronized": 0,
                      "changed": 0, "breaking": 0, "last_scan": None,
                      "monitoring": False, "connection": "not-connected"},
            "recent_activity": [],
            "last_changelog": None,
        }
    repo = rows[0]
    repo_id = repo["id"]

    latest_scan = db.query("SELECT * FROM scans WHERE repo_id = ? ORDER BY id DESC LIMIT 1", (repo_id,))
    latest_scan = latest_scan[0] if latest_scan else None

    endpoints = db.query("SELECT * FROM endpoints WHERE repo_id = ?", (repo_id,))
    total_endpoints = len(endpoints)

    # "Changed" endpoints from the latest scan; synchronized = rest
    changed_keys: set = set()
    recent: list[dict] = []
    if latest_scan:
        recent = db.query(
            "SELECT * FROM changes WHERE repo_id = ? AND scan_id = ? ORDER BY id DESC", (repo_id, latest_scan["id"]))
        for c in recent:
            changed_keys.add((c["method"], c["path"]))
    breaking = sum(1 for c in recent if c["severity"] == "BREAKING")

    activity = []
    changes_rows = db.query(
        "SELECT * FROM changes WHERE repo_id = ? ORDER BY id DESC LIMIT 6", (repo_id,))
    for c in changes_rows:
        before = db.loads(c.get("before_data"), {}) or {}
        after = db.loads(c.get("after_data"), {}) or {}
        if before.get("field") and after.get("field"):
            summary = f"{before['field']} → {after['field']}"
        else:
            summary = c["description"]
        activity.append({
            "method": c["method"], "path": c["path"], "severity": c["severity"],
            "summary": summary, "created_at": c["created_at"], "change_id": c["id"],
        })

    changelog_rows = db.query(
        "SELECT content FROM changelogs WHERE repo_id = ? ORDER BY id DESC LIMIT 1", (repo_id,))

    return {
        "stats": {
            "repository": repo["name"],
            "endpoints": total_endpoints,
            "synchronized": max(total_endpoints - len(changed_keys), 0),
            "changed": len(changed_keys),
            "breaking": breaking,
            "last_scan": repo["last_scan"],
            "monitoring": bool(repo["monitoring"]),
            "connection": "demo-local" if "demo" in repo["name"] else "github-webhook",
        },
        "recent_activity": activity,
        "last_changelog": changelog_rows[0]["content"] if changelog_rows else None,
    }


def list_endpoints(repo_name: str | None = None) -> list[dict]:
    sql = "SELECT e.* FROM endpoints e JOIN repositories r ON e.repo_id = r.id "
    params: tuple = ()
    if repo_name:
        sql += "WHERE r.name = ? "
        params = (repo_name,)
    sql += "ORDER BY e.path, e.method"
    rows = db.query(sql, params)
    result = []
    for r in rows:
        result.append({
            "id": r["id"], "method": r["method"], "path": r["path"],
            "summary": r["summary"], "description": r["description"],
            "params": db.loads(r["params"], []),
            "request_schema": db.loads(r["request_schema"]),
            "response_schema": db.loads(r["response_schema"]),
            "status_codes": db.loads(r["status_codes"], [200]),
            "auth": r["auth"], "source_file": r["source_file"],
        })
    return result


def list_changes(limit: int = 100) -> list[dict]:
    rows = db.query("SELECT * FROM changes ORDER BY id DESC LIMIT ?", (limit,))
    return [_change_out(r) for r in rows]


def get_change(change_id: int) -> dict | None:
    rows = db.query("SELECT * FROM changes WHERE id = ?", (change_id,))
    if not rows:
        return None
    out = _change_out(rows[0])
    analysis = db.query("SELECT * FROM analysis WHERE change_id = ? ORDER BY id DESC LIMIT 1", (change_id,))
    if analysis:
        out["explanation"] = analysis[0]["explanation"]
        out["risk_assessment"] = analysis[0]["risk_assessment"]
        out["recommendation"] = analysis[0]["recommendation"]
        out["ai_source"] = analysis[0]["source"]
    return out


def _change_out(r: dict) -> dict:
    files = db.query("SELECT file_path, reason FROM affected_files WHERE change_id = ?", (r["id"],))
    return {
        "id": r["id"], "method": r["method"], "path": r["path"],
        "change_type": r["change_type"], "severity": r["severity"],
        "description": r["description"],
        "before_data": db.loads(r["before_data"]),
        "after_data": db.loads(r["after_data"]),
        "created_at": r["created_at"],
        "affected_files": files,
    }


def get_repository() -> dict | None:
    rows = db.query("SELECT * FROM repositories ORDER BY last_scan DESC, id LIMIT 1")
    if not rows:
        return None
    r = rows[0]
    last_scan = db.query("SELECT * FROM scans WHERE repo_id = ? ORDER BY id DESC LIMIT 1", (r["id"],))
    last_change = db.query("SELECT * FROM changes WHERE repo_id = ? ORDER BY id DESC LIMIT 1", (r["id"],))
    return {
        "id": r["id"], "name": r["name"], "url": r["url"], "status": r["status"],
        "monitoring": bool(r["monitoring"]), "last_scan": r["last_scan"],
        "last_change": r["last_change"],
        "connection": "demo-local" if "demo" in r["name"] else "github-webhook",
        "scan_count": len(db.query("SELECT id FROM scans WHERE repo_id = ?", (r["id"],))),
        "last_scan_detail": {
            "source": last_scan[0]["source"], "status": last_scan[0]["status"],
            "message": last_scan[0]["message"], "endpoints_count": last_scan[0]["endpoints_count"],
            "changes_count": last_scan[0]["changes_count"], "created_at": last_scan[0]["created_at"],
        } if last_scan else None,
        "last_change_summary": last_change[0]["description"] if last_change else None,
    }


def generate_openapi(repo_name: str | None = None) -> dict:
    endpoints = list_endpoints(repo_name)
    name = repo_name or "API"
    spec = openapi_generator.generate(endpoints, title=f"{name} — Generated API")
    return spec
