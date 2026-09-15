"""Pydantic models for the demo FastAPI repository (VERSION 2).

BREAKING CHANGE: UserResponse.name renamed to full_name.
WARNING: UserResponse.avatar_url added.
"""
from typing import Optional


class UserCreate:
    name: str
    email: str
    role: Optional[str]


class UserResponse:
    id: int
    full_name: str
    email: str
    avatar_url: Optional[str]


class UserCreated:
    id: int
    email: str


class UserSummary:
    id: int
    name: str


class UserUpdated:
    id: int
    updated: bool


class OrderCreate:
    user_id: int
    product_id: int
    quantity: int


class OrderResponse:
    id: int
    user_id: int
    product_id: int
    status: str


class ProductCreate:
    name: str
    price: float
    category_id: int


class ProductResponse:
    id: int
    name: str
    price: float


class StatusUpdate:
    status: str


class HealthResponse:
    status: str
    version: str
