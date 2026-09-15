"""Pydantic response models for the API layer."""
from typing import Any, Optional
from pydantic import BaseModel


class DashboardStats(BaseModel):
    repository: str
    endpoints: int
    synchronized: int
    changed: int
    breaking: int
    last_scan: Optional[str] = None
    monitoring: bool = True
    connection: str = "demo-local"


class RecentActivity(BaseModel):
    method: str
    path: str
    severity: str
    summary: str
    created_at: str
    change_id: int


class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_activity: list[RecentActivity]
    last_changelog: Optional[str] = None


class EndpointOut(BaseModel):
    id: Optional[int] = None
    method: str
    path: str
    summary: Optional[str] = None
    description: Optional[str] = None
    params: list[dict] = []
    request_schema: Optional[dict] = None
    response_schema: Optional[dict] = None
    status_codes: list[int] = []
    auth: Optional[str] = None
    source_file: Optional[str] = None


class AffectedFileOut(BaseModel):
    file_path: str
    reason: str


class ChangeOut(BaseModel):
    id: int
    method: str
    path: str
    change_type: str
    severity: str
    description: str
    before_data: Optional[dict] = None
    after_data: Optional[dict] = None
    created_at: str
    affected_files: list[AffectedFileOut] = []


class ChangeDetailOut(ChangeOut):
    explanation: Optional[str] = None
    risk_assessment: Optional[str] = None
    recommendation: Optional[str] = None
    ai_source: Optional[str] = None


class RepositoryOut(BaseModel):
    id: int
    name: str
    url: Optional[str] = None
    status: str
    monitoring: bool
    last_scan: Optional[str] = None
    last_change: Optional[str] = None
    connection: str


class ScanResultOut(BaseModel):
    scan_id: int
    status: str
    message: str
    endpoints_count: int
    changes_count: int
    breaking_count: int
    changes: list[ChangeOut] = []
    changelog: Optional[str] = None


class ErrorResponse(BaseModel):
    detail: str
