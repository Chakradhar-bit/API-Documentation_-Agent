"""Tests for the users endpoints (VERSION 2, updated for full_name)."""


def test_get_user_shape(client):
    res = client.get("/users/1")
    body = res.json()
    assert "id" in body
    assert "full_name" in body
    assert "email" in body
