"""
Aegis Backend — Health Check Router
"""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from config import get_settings
from database import get_db

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Liveness + database connectivity check.
    Returns app version and DB connection status.
    """
    settings = get_settings()
    db_status = "connected"

    try:
        await db.execute(text("SELECT 1"))
    except Exception:
        db_status = "disconnected"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": db_status,
    }
