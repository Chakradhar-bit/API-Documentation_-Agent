"""User endpoints (VERSION 1)."""
from fastapi import APIRouter

from models import UserCreate, UserResponse, UserSummary, UserUpdated

router = APIRouter()


@router.get("/users")
def list_users(skip: int = 0, limit: int = 20) -> list[UserSummary]:
    """List all users with pagination."""
    return []


@router.post("/users", status_code=201)
def create_user(body: UserCreate) -> UserCreated:
    """Create a new user account."""
    return {}


@router.get("/users/{user_id}")
def get_user(user_id: int) -> UserResponse:
    """Retrieve a single user by ID.

    Returns the full user record including full_name and email.
    """
    return {"id": user_id, "full_name": "John", "email": "john@example.com"}


@router.put("/users/{user_id}")
def update_user(user_id: int, body: UserCreate) -> UserUpdated:
    """Update an existing user."""
    return UserUpdated(id=user_id, updated=True)


@router.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int):
    """Delete a user account."""
    return None


@router.get("/users/{user_id}/preferences")
def get_user_preferences(user_id: int):
    """Retrieve notification and display preferences for a user."""
    return {"user_id": user_id, "theme": "light", "notifications": True}
