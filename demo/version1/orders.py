"""Order endpoints (VERSION 1)."""
from fastapi import APIRouter

from models import OrderCreate, OrderResponse, StatusUpdate

router = APIRouter()


@router.get("/orders")
def list_orders(status: str = None, user_id: int = None):
    """List orders, optionally filtered by status or user."""
    return []


@router.post("/orders", status_code=201)
def create_order(body: OrderCreate):
    """Create a new order."""
    return {}


@router.get("/orders/{order_id}")
def get_order(order_id: int) -> OrderResponse:
    """Retrieve a single order by ID."""
    return OrderResponse(id=order_id, user_id=1, product_id=1, status="pending")


@router.put("/orders/{order_id}/status")
def update_order_status(order_id: int, body: StatusUpdate):
    """Update the status of an order."""
    return {"id": order_id, "status": body.status}


@router.delete("/orders/{order_id}", status_code=204)
def cancel_order(order_id: int):
    """Cancel an order."""
    return None


@router.get("/orders/{order_id}/items")
def get_order_items(order_id: int):
    """List the line items of an order."""
    return []
