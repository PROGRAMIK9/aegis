"""
Aegis Backend — Event Logger Service

Persists every scoring request to the events table for the audit trail.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from models.event import Event
from schemas.common import ScoreResult


async def log_event(
    db: AsyncSession,
    event_type: str,
    input_data: dict,
    result: ScoreResult,
) -> Event:
    """
    Create an audit trail entry and return it with the generated ID.
    """
    event = Event(
        type=event_type,
        input_data=input_data,
        score=result.score,
        verdict=result.verdict,
        tier=result.tier,
        reasons=result.reasons,
        breakdown=result.breakdown.model_dump() if result.breakdown else {},
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event
