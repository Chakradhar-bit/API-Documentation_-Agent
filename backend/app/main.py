"""API Documentation Agent — FastAPI application entry point."""
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from .api.routes import router  # noqa: E402
from .database.db import init_db  # noqa: E402

app = FastAPI(
    title="API Documentation Agent",
    description="Keeps API documentation synchronized with backend code.",
    version="1.0.0",
)

origins = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:4173,http://127.0.0.1:5173,http://127.0.0.1:4173",
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins] + ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "api-documentation-agent"}
