"""Tests for API extraction from the demo repository."""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services import api_extractor  # noqa: E402

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
V1 = os.path.abspath(os.path.join(BACKEND_DIR, "..", "demo", "version1"))
V2 = os.path.abspath(os.path.join(BACKEND_DIR, "..", "demo", "version2"))


def test_extracts_24_endpoints_from_demo():
    endpoints = api_extractor.scan_repo(V1)
    assert len(endpoints) == 24


def test_extracts_method_and_path():
    endpoints = api_extractor.scan_repo(V1)
    keys = {(e["method"], e["path"]) for e in endpoints}
    assert ("GET", "/users/{user_id}") in keys
    assert ("POST", "/users") in keys
    assert ("DELETE", "/users/{user_id}") in keys


def test_extracts_path_parameters():
    endpoints = api_extractor.scan_repo(V1)
    ep = next(e for e in endpoints if e["path"] == "/users/{user_id}" and e["method"] == "GET")
    path_params = [p for p in ep["params"] if p["in"] == "path"]
    assert path_params == [{"name": "user_id", "in": "path", "type": "integer", "required": True}]


def test_extracts_query_parameters_with_required_flag():
    endpoints = api_extractor.scan_repo(V1)
    ep = next(e for e in endpoints if e["path"] == "/users" and e["method"] == "GET")
    by_name = {p["name"]: p for p in ep["params"]}
    assert by_name["skip"]["required"] is False
    assert by_name["limit"]["required"] is False


def test_extracts_request_body_schema():
    endpoints = api_extractor.scan_repo(V1)
    ep = next(e for e in endpoints if e["path"] == "/users" and e["method"] == "POST")
    assert ep["request_schema"]["model"] == "UserCreate"
    assert ep["request_schema"]["fields"]["name"] == "string"
    assert ep["request_schema"]["fields"]["email"] == "string"


def test_extracts_response_schema_from_return_annotation():
    endpoints = api_extractor.scan_repo(V1)
    ep = next(e for e in endpoints if e["path"] == "/users/{user_id}" and e["method"] == "GET")
    assert ep["response_schema"]["model"] == "UserResponse"
    assert ep["response_schema"]["fields"]["name"] == "string"
    assert ep["response_schema"]["fields"]["id"] == "integer"


def test_extracts_list_response_schema():
    endpoints = api_extractor.scan_repo(V1)
    ep = next(e for e in endpoints if e["path"] == "/users" and e["method"] == "GET")
    assert ep["response_schema"]["model"] == "UserSummary"
    assert ep["response_schema"]["many"] is True


def test_extracts_status_code():
    endpoints = api_extractor.scan_repo(V1)
    ep = next(e for e in endpoints if e["path"] == "/users" and e["method"] == "POST")
    assert ep["status_codes"] == [201]


def test_extracts_docstring_summary():
    endpoints = api_extractor.scan_repo(V1)
    ep = next(e for e in endpoints if e["path"] == "/health")
    assert "health" in ep["summary"].lower()


def test_invalid_repo_raises():
    import pytest
    with pytest.raises(FileNotFoundError):
        api_extractor.scan_repo("./does-not-exist")


def test_invalid_python_file_is_skipped(tmp_path):
    (tmp_path / "broken.py").write_text("def broken(:\n")
    (tmp_path / "ok.py").write_text(
        "from fastapi import APIRouter\nrouter = APIRouter()\n\n"
        "@router.get('/ping')\ndef ping():\n    '''Ping.'''\n    return {}\n")
    endpoints = api_extractor.scan_repo(str(tmp_path))
    assert len(endpoints) == 1
    assert endpoints[0]["path"] == "/ping"
