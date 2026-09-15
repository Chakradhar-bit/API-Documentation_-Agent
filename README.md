# API Documentation Agent

An AI-powered developer tool that keeps API documentation synchronized with backend code.

After a one-time repository integration, the agent monitors changes, extracts the API surface from
FastAPI/Python source code, detects changes between scans, classifies breaking changes, performs
impact analysis across the repository, generates an up-to-date OpenAPI 3.x specification, and
produces human-readable explanations and changelogs.

## Problem

API documentation drifts out of sync with code. Backend teams change endpoints, rename response
fields, remove parameters — and the docs (and the clients that trusted them) silently break.

## Solution

API Documentation Agent scans the repository on every change and, **without requiring any AI**:

1. Extracts every endpoint (method, path, parameters, request/response schemas, status codes, auth).
2. Stores a versioned API snapshot in SQLite.
3. Diffs the new snapshot against the previous one.
4. Classifies every difference as `SAFE`, `WARNING`, or `BREAKING CHANGE` (deterministic rules).
5. Finds repository files affected by each change (impact analysis).
6. Generates a valid OpenAPI 3.x specification and validates it.
7. Uses an LLM (optional) for human-readable explanations, risk assessment and changelogs —
   with a deterministic fallback when no API key is configured.

## Features

- **API extraction** — Python `ast`-based parser for FastAPI routers (`@app.get`, `@router.post`, …).
- **Snapshot system** — every scan is stored as a versioned snapshot in SQLite.
- **Change detection** — added/removed endpoints, method changes, parameter changes, request/response
  schema changes, status-code changes, authentication changes.
- **Breaking-change classification** — deterministic; rename detection (`name → full_name`),
  required-parameter removal, endpoint removal, method changes.
- **Impact analysis** — searches the repository for references to affected endpoints, models and fields.
- **OpenAPI generation** — valid OpenAPI 3.0.3 with in-app documentation browser and `openapi.json` download.
- **Built-in demo** — two repository versions and a `Run Demo Change` button that runs the complete
  pipeline without GitHub authentication.
- **GitHub integration architecture** — `POST /webhooks/github` with signature verification, push/PR
  event parsing, and repository clone/update.
- **Professional light SaaS UI** — splash animation, dashboard, API explorer, changes, change details,
  documentation browser, repository monitor.

## Architecture

```
GitHub Repository
        ↓
Change Monitor  (POST /webhooks/github)
        ↓
Code Parser / API Extractor  (Python ast)
        ↓
API Change Detector  (snapshot diff)
        ↓
Breaking Change Detection  (deterministic rules)
        ↓
Impact Analysis
        ↓
OpenAPI Generator  (+ validation)
        ↓
AI Analysis (optional)  →  SQLite  →  Documentation Dashboard
```

## Technology Stack

| Layer     | Technology                                   |
|-----------|----------------------------------------------|
| Frontend  | React 18, Vite 5, TypeScript, Tailwind CSS 3 |
| Backend   | Python 3.11+, FastAPI, Pydantic v2           |
| Analysis  | Python `ast` (no AI required)                |
| Database  | SQLite (stdlib `sqlite3`)                    |
| AI        | OpenAI-compatible chat API (optional)        |

## Project Structure

```
backend/
  app/
    main.py                 # FastAPI entry point + CORS
    api/routes.py           # REST endpoints + webhook
    database/db.py          # SQLite access layer
    schemas/schemas.py      # Pydantic response models
    services/
      api_extractor.py      # AST-based FastAPI endpoint extraction
      change_detector.py    # Snapshot diff + severity classification
      impact_analyzer.py    # Affected-file search
      openapi_generator.py  # OpenAPI 3.x generation + validation
      ai_analyzer.py        # LLM abstraction + deterministic fallback
      github_service.py     # Webhook parsing + signature verification
      scan_service.py       # Pipeline orchestration + persistence
  tests/                    # 36 tests (extraction, changes, workflow, HTTP)
demo/
  version1/                 # Demo repo v1 (24 endpoints, UserResponse.name)
  version2/                 # Demo repo v2 (name → full_name, +added/removed endpoint)
frontend/
  src/
    components/             # Layout, badges, cards
    pages/                  # Dashboard, ApiExplorer, Changes, ChangeDetails, Documentation, Repository
    services/api.ts         # Typed backend client
    types/                  # Shared TypeScript types
```

## Local Setup

Requirements: Python 3.11+ and Node 18+.

```bash
# 1. Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --port 8000

# 2. Frontend (second terminal)
cd frontend
npm install
npm run dev          # http://localhost:5173 (proxies /api to :8000)
```

## Environment Variables

Copy `.env.example` to `.env` (backend root) and fill in what you need:

| Variable                | Purpose                                                     |
|-------------------------|-------------------------------------------------------------|
| `CORS_ORIGINS`          | Allowed frontend origins                                    |
| `ADA_DB_PATH`           | SQLite database location                                    |
| `GITHUB_TOKEN`          | Token for cloning private repositories (webhook flow)       |
| `GITHUB_WEBHOOK_SECRET` | Webhook signature secret (empty = skip verification in dev) |
| `LLM_API_KEY`           | Optional; enables AI explanations (OpenAI-compatible)       |
| `LLM_PROVIDER`          | `openai` \| `openrouter` \| `groq` (default `openai`)       |
| `LLM_MODEL`             | Model name (default `gpt-4o-mini`)                          |

Secrets are only read from the environment — never hardcode them.

## Demo Instructions

1. Open http://localhost:5173 — the app opens with the launch screen and transitions to the dashboard.
2. Click **Run Demo Change**:
   - scans `demo/version1` as the baseline snapshot (24 endpoints),
   - scans `demo/version2` and diffs the snapshots,
   - detects 5 changes: response field rename `name → full_name` (**BREAKING**),
     `avatar_url` added (**WARNING**), `GET /users/{user_id}/orders` removed (**BREAKING**),
     `GET /users/{user_id}/preferences` added (**SAFE**), `sort` parameter added (**SAFE**),
   - runs impact analysis (8 affected files for the rename),
   - generates AI analysis + changelog (deterministic fallback without an API key),
   - displays everything in the Changes page and dashboard.
3. Explore **API Explorer**, **Documentation** (download `openapi.json`), and **Repository** pages.

## Backend API

| Method | Path                    | Description                            |
|--------|-------------------------|----------------------------------------|
| GET    | `/api/dashboard`        | Stats + recent activity + changelog    |
| GET    | `/api/endpoints`        | Detected endpoints                     |
| GET    | `/api/changes`          | Detected changes                       |
| GET    | `/api/changes/{id}`     | Change detail + AI analysis            |
| GET    | `/api/repository`       | Repository status                      |
| GET    | `/api/snapshots`        | Stored API snapshots                   |
| GET    | `/api/openapi`          | Generated OpenAPI spec (`?download=1`) |
| GET    | `/api/openapi/validate` | Spec validation result                 |
| GET    | `/api/changelogs`       | Generated changelogs                   |
| POST   | `/api/scan`             | Manual scan (dev/demo fallback)        |
| POST   | `/api/demo/run`         | Built-in two-version demo workflow     |
| POST   | `/webhooks/github`      | GitHub push/pull_request webhook       |

## GitHub Webhook Setup

1. In your repository: **Settings → Webhooks → Add webhook**.
2. Payload URL: `https://<your-domain>/webhooks/github`
3. Content type: `application/json`
4. Secret: set the same value as `GITHUB_WEBHOOK_SECRET` in the backend environment.
5. Events: **Push** and **Pull request**.

The backend verifies the `X-Hub-Signature-256` header (HMAC-SHA256), identifies the repository,
clones/updates it locally (`GITHUB_TOKEN` for private repos), and runs the full analysis pipeline.

## Testing

```bash
cd backend
python -m pytest tests -v     # 36 tests: extraction, detection, classification, snapshots, demo workflow, HTTP API
```

## Deployment

```bash
# Frontend production build
cd frontend
npm run build            # outputs frontend/dist
npm run preview          # serves the build on :4173 (proxies /api like dev)
```

- **CORS**: set `CORS_ORIGINS` on the backend to your deployed frontend origin.
- **Backend**: run `uvicorn app.main:app --port 8000` behind your process manager
  (e.g. `gunicorn -k uvicorn.workers.UvicornWorker` / systemd / Docker).
- **Database**: set `ADA_DB_PATH` to a persistent volume path.
- The frontend build can be served by any static host; point its `/api` and `/webhooks` traffic
  to the backend (e.g. reverse proxy in nginx, or platform rewrites).

## Screenshots

_Add captures of:_

1. Launch screen with loading indicator
2. Dashboard with stat cards, Run Demo Change and Recent Activity
3. Changes table with severity filters
4. Change Details (BEFORE/AFTER, affected files, AI analysis)
5. API Explorer
6. Generated OpenAPI documentation
