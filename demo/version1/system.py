"""System and category endpoints (VERSION 1)."""
from fastapi import APIRouter

from models import HealthResponse, ProductCreate, ProductResponse

router = APIRouter()


@router.get("/health")
def health_check() -> HealthResponse:
    """Service health probe."""
    return HealthResponse(status="ok", version="1.0.0")


@router.get("/version")
def get_version():
    """Return the current API version."""
    return {"version": "1.0.0"}


@router.get("/metrics")
def get_metrics():
    """Prometheus-style service metrics."""
    return {"requests": 0, "errors": 0}


@router.get("/stats")
def get_stats():
    """Aggregate platform statistics."""
    return {"users": 0, "orders": 0, "products": 0}


@router.post("/categories/{category_id}/products", status_code=201)
def add_product_to_category(category_id: int, body: ProductCreate):
    """Add a product to a category."""
    return ProductResponse(id=1, name=body.name, price=body.price)
