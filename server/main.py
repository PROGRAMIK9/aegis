"""
Aegis — Real-time Phishing & Fraud Detection Platform

FastAPI application entrypoint.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import init_db, close_db
from routers import health_router, phishing_router, fraud_router, events_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables. Shutdown: dispose engine."""
    await init_db()
    yield
    await close_db()


settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────
app.include_router(health_router)
app.include_router(phishing_router)
app.include_router(fraud_router)
app.include_router(events_router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }
