"""Demo FastAPI app (VERSION 1)."""
from fastapi import FastAPI

import users
import orders
import products
import system

app = FastAPI(title="Demo FastAPI Store", version="1.0.0")
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(products.router)
app.include_router(system.router)
