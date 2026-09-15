"""GitHub Service — webhook payload handling and signature verification."""
import hashlib
import hmac
import json
import os
from typing import Optional


def verify_signature(payload: bytes, signature_header: Optional[str]) -> bool:
    """Validate the X-Hub-Signature-256 header against GITHUB_WEBHOOK_SECRET."""
    secret = os.environ.get("GITHUB_WEBHOOK_SECRET")
    if not secret:
        # No secret configured: accept (local development mode)
        return True
    if not signature_header or not signature_header.startswith("sha256="):
        return False
    expected = hmac.new(secret.encode("utf-8"), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature_header[7:])


def parse_push_event(payload: dict) -> dict | None:
    """Extract repository name/URL and changed Python files from a push event."""
    repo = payload.get("repository") or {}
    name = repo.get("name")
    if not name:
        return None
    changed: set[str] = set()
    for commit in payload.get("commits", []):
        for key in ("added", "modified", "removed"):
            for f in commit.get(key, []):
                changed.add(f)
    return {
        "name": name,
        "url": repo.get("html_url"),
        "default_branch": repo.get("default_branch", "main"),
        "changed_files": sorted(changed),
        "event": "push",
    }


def parse_pr_event(payload: dict) -> dict | None:
    action = payload.get("action")
    if action not in ("opened", "synchronize", "reopened"):
        return None
    repo = payload.get("repository") or {}
    pr = payload.get("pull_request") or {}
    return {
        "name": repo.get("name"),
        "url": repo.get("html_url"),
        "default_branch": repo.get("default_branch", "main"),
        "changed_files": [],
        "event": f"pull_request.{action}",
        "pr_number": pr.get("number"),
    }


def clone_or_update(repo_url: str, workdir: str) -> str:
    """Clone (or update) a GitHub repository into a local working directory.

    Uses a plain `git` subprocess; GITHUB_TOKEN, when present, is used for
    private repository access over HTTPS.
    """
    import subprocess
    os.makedirs(workdir, exist_ok=True)
    target = os.path.join(workdir, os.path.basename(repo_url.rstrip("/")).removesuffix(".git"))
    token = os.environ.get("GITHUB_TOKEN")
    url = repo_url
    if token and repo_url.startswith("https://"):
        url = repo_url.replace("https://", f"https://{token}@")
    if os.path.isdir(os.path.join(target, ".git")):
        subprocess.run(["git", "-C", target, "pull", "--ff-only"], check=False, capture_output=True)
    else:
        subprocess.run(["git", "clone", "--depth", "1", url, target], check=False, capture_output=True)
    if not os.path.isdir(target):
        raise RuntimeError(f"Failed to clone repository {repo_url}. Check GITHUB_TOKEN and the URL.")
    return target
