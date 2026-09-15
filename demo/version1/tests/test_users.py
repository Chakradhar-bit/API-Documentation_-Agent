"""Tests for the users endpoints (VERSION 1)."""


def test_get_user_shape(client):
    res = client.get("/users/1")
    body = res.json()
    assert "id" in body
    assert "name" in body
    assert "email" in body
