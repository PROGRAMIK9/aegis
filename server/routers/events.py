"""
Aegis Backend — Events Router (Dashboard Feed)
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.event import Event
from schemas.events import EventListResponse, EventResponse

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=EventListResponse)
async def list_events(
    type: str | None = Query(default=None, description="Filter by event type: phishing | fraud"),
    limit: int = Query(default=20, ge=1, le=100, description="Max events to return"),
    offset: int = Query(default=0, ge=0, description="Pagination offset"),
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve recent events for the dashboard live feed.

    Supports filtering by type and pagination.
    Ordered by most recent first.
    """
    # Base query
    query = select(Event).order_by(Event.created_at.desc())
    count_query = select(func.count(Event.id))

    # Filter by type if provided
    if type is not None:
        query = query.where(Event.type == type)
        count_query = count_query.where(Event.type == type)

    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Get paginated events
    query = query.offset(offset).limit(limit)
    result = await db.execute(query)
    events = result.scalars().all()

    return EventListResponse(
        events=[EventResponse.model_validate(e) for e in events],
        total=total,
    )
