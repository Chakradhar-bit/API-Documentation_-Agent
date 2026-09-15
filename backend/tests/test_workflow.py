"""End-to-end tests: OpenAPI generation, snapshots, demo workflow, HTTP API."""
import os
import sys

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Use a throwaway database for the test session
os.environ["ADA_DB_PATH"] = os.path.join(os.path.dirname(__file__), "..", "..", "data", "test_agent.db")

from app.main import app  # noqa: E402
from app.database import db  # noqa: E402
from app.services import openapi_generator, scan_service  # noqa: E402

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
V1 = os.path.abspath(os.path.join(BACKEND_DIR, "..", "demo", "version1"))
V2 = os.path.abspath(os.path.join(BACKEND_DIR, "..", "demo", "version2"))


@pytest.fixture(scope="module", autouse=True)
def clean_db():
    if os.path.exists(db.DB_PATH):
        os.remove(db.DB_PATH)
    db.init_db()
    yield


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_openapi_generation_structure():
    endpoints = scan_service.list_endpoints() or None
    from app.services import api_extractor
    eps = api_extractor.scan_repo(V1)
    spec = openapi_generator.generate(eps, title="Test API")
    assert spec["openapi"] == "3.0.3"
    assert "/users/{user_id}" in spec["paths"]
    op = spec["paths"]["/users/{user_id}"]["get"]
    assert op["responses"]["200"]["content"]["application/json"]["schema"]["$ref"].endswith("UserResponse")
    param_names = [p["name"] for p in op["parameters"]]
    assert "user_id" in param_names
    assert "UserResponse" in spec["components"]["schemas"]


def test_openapi_validation_passes():
    endpoints = scan_service.list_endpoints()
    spec = openapi_generator.generate(endpoints or [], title="t")
    assert openapi_generator.validate(spec) == []


def test_snapshot_created_with_version():
    result = scan_service.run_scan("test-repo-snap", V1, source="test")
    assert result["endpoints_count"] == 24
    snaps = db.query("SELECT * FROM snapshots ORDER BY id")
    assert len(snaps) >= 1
    import json
    payload = json.loads(snaps[-1]["payload"])
    assert isinstance(payload, list) and len(payload) == 24
    ep = next(e for e in payload if e["path"] == "/users/{user_id}" and e["method"] == "GET")
    assert "params" in ep and "auth" in ep


def test_full_demo_workflow(client):
    response = client.post("/api/demo/run")
    assert response.status_code == 200
    body = response.json()
    assert body["endpoints_count"] == 24
    assert body["changes_count"] == 5
    assert body["breaking_count"] == 2

    types = {c["change_type"] for c in body["changes"]}
    assert "response_field_renamed" in types
    assert "added_endpoint" in types
    assert "removed_endpoint" in types
    assert "param_added" in types

    renamed = next(c for c in body["changes"] if c["change_type"] == "response_field_renamed")
    assert renamed["severity"] == "BREAKING"
    assert renamed["before_data"]["field"] == "name"
    assert renamed["after_data"]["field"] == "full_name"
    assert renamed["affected_files"], "impact analysis should list affected files"
    assert renamed["description"]


def test_dashboard_after_demo(client):
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    stats = response.json()["stats"]
    assert stats["repository"] == "demo-fastapi"
    assert stats["endpoints"] == 24
    assert stats["breaking"] == 2


def test_changes_endpoint_and_detail(client):
    response = client.get("/api/changes")
    assert response.status_code == 200
    changes = response.json()
    assert len(changes) >= 5
    demo_changes = [c for c in changes if c["path"].startswith("/users")]
    assert any(c["change_type"] == "response_field_renamed" for c in demo_changes)
    first = next(c for c in changes if c["change_type"] == "response_field_renamed")
    detail = client.get(f"/api/changes/{first['id']}")
    assert detail.status_code == 200
    body = detail.json()
    assert "explanation" in body and body["explanation"]
    assert "recommendation" in body
    assert "affected_files" in body


def test_change_detail_404(client):
    assert client.get("/api/changes/99999").status_code == 404


def test_openapi_endpoint(client):
    response = client.get("/api/openapi")
    assert response.status_code == 200
    spec = response.json()
    assert spec["openapi"] == "3.0.3"
    assert client.get("/api/openapi/validate").json()["valid"] is True


def test_snapshots_endpoint(client):
    response = client.get("/api/snapshots")
    assert response.status_code == 200
    snaps = response.json()
    assert len(snaps) >= 2
    assert all("version" in s and "endpoints_count" in s for s in snaps)


def test_repository_endpoint(client):
    response = client.get("/api/repository")
    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "demo-fastapi"
    assert body["last_scan"]


def test_health(client):
    assert client.get("/api/health").json()["status"] == "ok"
