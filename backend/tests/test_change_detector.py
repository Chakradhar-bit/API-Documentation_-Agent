"""Tests for change detection and breaking-change classification."""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services import api_extractor, change_detector as cd  # noqa: E402

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
V1 = os.path.abspath(os.path.join(BACKEND_DIR, "..", "demo", "version1"))
V2 = os.path.abspath(os.path.join(BACKEND_DIR, "..", "demo", "version2"))


def _ep(method, path, **kw):
    base = {"method": method, "path": path, "params": [], "request_schema": None,
            "response_schema": None, "status_codes": [200], "auth": None}
    base.update(kw)
    return base


def test_demo_change_summary():
    old = api_extractor.scan_repo(V1)
    new = api_extractor.scan_repo(V2)
    changes = cd.detect_changes(old, new)
    summary = cd.summarize(changes)
    assert summary["total"] == 5
    assert summary["breaking"] == 2
    assert summary["warnings"] == 1
    assert summary["safe"] == 2


def test_added_endpoint_detected_as_safe():
    old = api_extractor.scan_repo(V1)
    new = api_extractor.scan_repo(V2)
    changes = cd.detect_changes(old, new)
    added = [c for c in changes if c["change_type"] == "added_endpoint"]
    assert len(added) == 1
    assert added[0]["path"] == "/users/{user_id}/preferences"
    assert added[0]["severity"] == cd.SAFE


def test_removed_endpoint_detected_as_breaking():
    old = api_extractor.scan_repo(V1)
    new = api_extractor.scan_repo(V2)
    changes = cd.detect_changes(old, new)
    removed = [c for c in changes if c["change_type"] == "removed_endpoint"]
    assert len(removed) == 1
    assert removed[0]["path"] == "/users/{user_id}/orders"
    assert removed[0]["severity"] == cd.BREAKING


def test_response_field_rename_is_breaking():
    old = api_extractor.scan_repo(V1)
    new = api_extractor.scan_repo(V2)
    changes = cd.detect_changes(old, new)
    renamed = [c for c in changes if c["change_type"] == "response_field_renamed"]
    assert len(renamed) == 1
    assert renamed[0]["before_data"]["field"] == "name"
    assert renamed[0]["after_data"]["field"] == "full_name"
    assert renamed[0]["severity"] == cd.BREAKING


def test_response_field_added_is_warning():
    old = api_extractor.scan_repo(V1)
    new = api_extractor.scan_repo(V2)
    changes = cd.detect_changes(old, new)
    added_fields = [c for c in changes if c["change_type"] == "response_field_added"]
    assert len(added_fields) == 1
    assert added_fields[0]["after_data"]["field"] == "avatar_url"
    assert added_fields[0]["severity"] == cd.WARNING


def test_optional_param_added_is_safe():
    old = api_extractor.scan_repo(V1)
    new = api_extractor.scan_repo(V2)
    changes = cd.detect_changes(old, new)
    params = [c for c in changes if c["change_type"] == "param_added"]
    assert len(params) == 1
    assert params[0]["after_data"]["name"] == "sort"
    assert params[0]["severity"] == cd.SAFE


def test_required_param_removed_is_breaking():
    old = [_ep("GET", "/items", params=[{"name": "q", "in": "query", "type": "string", "required": True}])]
    new = [_ep("GET", "/items")]
    changes = cd.detect_changes(old, new)
    assert any(c["change_type"] == "param_removed" and c["severity"] == cd.BREAKING for c in changes)


def test_optional_param_removed_is_warning():
    old = [_ep("GET", "/items", params=[{"name": "page", "in": "query", "type": "integer", "required": False}])]
    new = [_ep("GET", "/items")]
    changes = cd.detect_changes(old, new)
    assert any(c["change_type"] == "param_removed" and c["severity"] == cd.WARNING for c in changes)


def test_param_type_changed():
    old = [_ep("GET", "/items", params=[{"name": "id", "in": "path", "type": "integer", "required": True}])]
    new = [_ep("GET", "/items", params=[{"name": "id", "in": "path", "type": "string", "required": True}])]
    changes = cd.detect_changes(old, new)
    assert any(c["change_type"] == "param_type_changed" and c["severity"] == cd.BREAKING for c in changes)


def test_request_field_removed_is_breaking():
    old_schema = {"model": "ItemIn", "fields": {"name": "string", "price": "number"}}
    new_schema = {"model": "ItemIn", "fields": {"name": "string"}}
    old = [_ep("POST", "/items", request_schema=old_schema)]
    new = [_ep("POST", "/items", request_schema=new_schema)]
    changes = cd.detect_changes(old, new)
    assert any(c["change_type"] == "request_field_removed" and c["severity"] == cd.BREAKING for c in changes)


def test_request_field_added_is_safe():
    old_schema = {"model": "ItemIn", "fields": {"name": "string"}}
    new_schema = {"model": "ItemIn", "fields": {"name": "string", "tags": "array"}}
    old = [_ep("POST", "/items", request_schema=old_schema)]
    new = [_ep("POST", "/items", request_schema=new_schema)]
    changes = cd.detect_changes(old, new)
    assert any(c["change_type"] == "request_field_added" and c["severity"] == cd.SAFE for c in changes)


def test_http_method_change_is_breaking():
    old = [_ep("GET", "/reports")]
    new = [_ep("POST", "/reports")]
    changes = cd.detect_changes(old, new)
    assert any(c["change_type"] == "method_changed" and c["severity"] == cd.BREAKING for c in changes)


def test_auth_removed_is_breaking():
    old = [_ep("GET", "/admin", auth="Bearer token (Depends detected)")]
    new = [_ep("GET", "/admin")]
    changes = cd.detect_changes(old, new)
    assert any(c["change_type"] == "auth_changed" and c["severity"] == cd.BREAKING for c in changes)


def test_identical_snapshots_produce_no_changes():
    eps = api_extractor.scan_repo(V1)
    assert cd.detect_changes(eps, eps) == []
