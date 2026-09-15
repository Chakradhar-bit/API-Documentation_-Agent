"""SQLite database access layer (stdlib sqlite3, JSON blob storage)."""
import json
import os
import sqlite3
from typing import Any, Optional

DB_PATH = os.environ.get("ADA_DB_PATH", os.path.join(os.path.dirname(__file__), "..", "..", "data", "agent.db"))
DB_PATH = os.path.abspath(DB_PATH)


def get_conn() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


SCHEMA = """
CREATE TABLE IF NOT EXISTS repositories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    url TEXT,
    status TEXT DEFAULT 'connected',
    monitoring INTEGER DEFAULT 1,
    last_scan TEXT,
    last_change TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER NOT NULL REFERENCES repositories(id),
    payload TEXT NOT NULL,
    version INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS endpoints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER NOT NULL REFERENCES repositories(id),
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    summary TEXT,
    description TEXT,
    params TEXT,
    request_schema TEXT,
    response_schema TEXT,
    status_codes TEXT,
    auth TEXT,
    source_file TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER NOT NULL REFERENCES repositories(id),
    source TEXT,
    status TEXT,
    message TEXT,
    endpoints_count INTEGER DEFAULT 0,
    changes_count INTEGER DEFAULT 0,
    breaking_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS changes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER NOT NULL REFERENCES repositories(id),
    scan_id INTEGER REFERENCES scans(id),
    method TEXT,
    path TEXT,
    change_type TEXT,
    severity TEXT,
    description TEXT,
    before_data TEXT,
    after_data TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS affected_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    change_id INTEGER NOT NULL REFERENCES changes(id),
    file_path TEXT,
    reason TEXT
);
CREATE TABLE IF NOT EXISTS analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    change_id INTEGER NOT NULL REFERENCES changes(id),
    explanation TEXT,
    risk_assessment TEXT,
    recommendation TEXT,
    source TEXT
);
CREATE TABLE IF NOT EXISTS changelogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER NOT NULL REFERENCES repositories(id),
    scan_id INTEGER,
    content TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
"""


def init_db() -> None:
    conn = get_conn()
    conn.executescript(SCHEMA)
    conn.commit()
    conn.close()


def query(sql: str, params: tuple = ()) -> list:
    conn = get_conn()
    rows = conn.execute(sql, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def execute(sql: str, params: tuple = ()) -> int:
    conn = get_conn()
    cur = conn.execute(sql, params)
    conn.commit()
    last_id = cur.lastrowid
    conn.close()
    return last_id


def loads(value: Any, default: Any = None) -> Any:
    if value is None:
        return default
    if isinstance(value, (dict, list)):
        return value
    try:
        return json.loads(value)
    except (json.JSONDecodeError, TypeError):
        return default
