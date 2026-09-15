"""REST API routes for the API Documentation Agent."""
import json
import os

from fastapi import APIRouter, HTTPException, Request, Response

from ..services import scan_service, github_service, openapi_generator
from ..database import db

router = APIRouter()

# Local path used as the scan target for POST /api/scan (dev/demo fallback)
LOCAL_SCAN_DIR = os.environ.get("ADA_SCAN_DIR") or scan_service.DEMO_ROOT


@router.get("/api/dashboard")
def dashboard():
    return scan_service.get_dashboard()


@router.get("/api/endpoints")
def endpoints(repo: str | None = None):
    return scan_service.list_endpoints(repo)


@router.get("/api/changes")
def changes(limit: int = 100):
    return scan_service.list_changes(limit)


@router.get("/api/changes/{change_id}")
def change_detail(change_id: int):
    result = scan_service.get_change(change_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"Change #{change_id} not found")
    return result


@router.get("/api/repository")
def repository():
    result = scan_service.get_repository()
    if not result:
        return {"name": None, "status": "not-connected", "monitoring": False,
                "last_scan": None, "last_change": None, "connection": "not-connected",
                "scan_count": 0, "last_scan_detail": None, "last_change_summary": None}
    return result


@router.post("/api/scan")
async def manual_scan(request: Request):
    """Manual development/demo fallback: scan a local directory."""
    raw = await request.body()
    try:
        body = json.loads(raw.decode("utf-8")) if raw.strip() else {}

    except Exception:
        body = {}
    repo_name = body.get("repo_name") or "demo-fastapi"
    repo_path = body.get("repo_path") or LOCAL_SCAN_DIR
    try:
        result = scan_service.run_scan(repo_name, repo_path, source="manual")
    except FileNotFoundError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:  # failed scan
        raise HTTPException(status_code=500, detail=f"Scan failed: {exc}")
    return result


@router.post("/api/demo/run")
def demo_run():
    """Built-in demo: scan version1 baseline then version2, full pipeline."""
    try:
        return scan_service.run_demo()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Demo failed: {exc}")


@router.post("/webhooks/github")
async def github_webhook(request: Request):
    raw = await request.body()
    signature = request.headers.get("X-Hub-Signature-256")
    if not github_service.verify_signature(raw, signature):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    event = request.headers.get("X-GitHub-Event", "push")
    try:
        payload = json.loads(raw.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid webhook payload: not valid JSON")

    if event == "ping":
        return {"status": "ok", "message": "Webhook configured successfully"}

    parsed = None
    if event == "push":
        parsed = github_service.parse_push_event(payload)
    elif event == "pull_request":
        parsed = github_service.parse_pr_event(payload)
    if not parsed:
        raise HTTPException(status_code=422, detail=f"Unsupported or malformed GitHub event: {event}")

    repo_url = parsed.get("url")
    if not repo_url:
        raise HTTPException(status_code=422, detail="Webhook payload missing repository URL")

    workdir = os.environ.get("ADA_CLONE_DIR", os.path.join(scan_service.BASE_DIR, "clones"))
    try:
        target = github_service.clone_or_update(repo_url, workdir)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"GitHub error: {exc}")

    try:
        result = scan_service.run_scan(parsed["name"], target, source=f"github:{parsed['event']}", url=repo_url)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Scan failed after webhook: {exc}")
    return {
        "status": "ok",
        "message": result["message"],
        "scan_id": result["scan_id"],
        "changes_count": result["changes_count"],
        "breaking_count": result["breaking_count"],
    }


@router.get("/api/openapi")
def openapi_spec(repo: str | None = None, download: int = 0):
    spec = scan_service.generate_openapi(repo)
    if download:
        return Response(
            content=json.dumps(spec, indent=2),
            media_type="application/json",
            headers={"Content-Disposition": 'attachment; filename="openapi.json"'},
        )
    return spec


@router.get("/api/openapi/validate")
def validate_openapi():
    spec = scan_service.generate_openapi()
    errors = openapi_generator.validate(spec)
    return {"valid": len(errors) == 0, "errors": errors}


@router.get("/api/snapshots")
def snapshots(repo: str | None = None):
    """List stored API snapshots (metadata + endpoint counts)."""
    sql = """SELECT s.id, s.repo_id, s.version, s.created_at, r.name AS repo_name
             FROM snapshots s JOIN repositories r ON s.repo_id = r.id """
    params: tuple = ()
    if repo:
        sql += "WHERE r.name = ? "
        params = (repo,)
    sql += "ORDER BY s.id DESC"
    rows = db.query(sql, params)
    for r in rows:
        payload = db.loads(db.query("SELECT payload FROM snapshots WHERE id = ?", (r["id"],))[0]["payload"], [])
        r["endpoints_count"] = len(payload)
    return rows


@router.get("/api/changelogs")
def changelogs():
    rows = db.query(
        """SELECT c.* FROM changelogs c JOIN repositories r ON c.repo_id = r.id
           ORDER BY c.id DESC LIMIT 20""")
    return [{"id": r["id"], "content": r["content"], "created_at": r["created_at"]} for r in rows]


@router.get("/api/scans")
def scans():
    return db.query("SELECT * FROM scans ORDER BY id DESC LIMIT 20")
