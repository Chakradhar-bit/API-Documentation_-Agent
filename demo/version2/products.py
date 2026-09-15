"""Product and category endpoints (VERSION 1)."""
from typing import Optional

from fastapi import APIRouter

from models import ProductCreate, ProductResponse

router = APIRouter()


@router.get("/products")
def list_products(category_id: int = None, min_price: float = None):
    """List products, optionally filtered by category or price."""
    return []


@router.post("/products", status_code=201)
def create_product(body: ProductCreate):
    """Create a new product."""
    return {}


@router.get("/products/{product_id}")
def get_product(product_id: int) -> ProductResponse:
    """Retrieve a single product by ID."""
    return ProductResponse(id=product_id, name="Widget", price=9.99)


@router.put("/products/{product_id}")
def update_product(product_id: int, body: ProductCreate):
    """Update an existing product."""
    return ProductResponse(id=product_id, name=body.name, price=body.price)


@router.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int):
    """Delete a product."""
    return None


@router.get("/products/search")
def search_products(q: str, limit: int = 10):
    """Full-text search across the product catalog."""
    return []


@router.get("/categories")
def list_categories():
    """List all product categories."""
    return []
