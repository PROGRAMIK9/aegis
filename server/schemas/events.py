"""
Aegis Backend — Event Schemas (for GET /events dashboard feed)
"""

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator

from .common import RiskTier


EventType = Literal["phishing", "fraud"]


class EventResponse(BaseModel):
    """Single event in the audit trail."""

    id: int = Field(gt=0, description="Auto-incremented event ID")
    type: EventType = Field(description="Event type: phishing | fraud")
    input_data: dict[str, Any] = Field(description="Raw request payload stored as JSON")
    score: float = Field(ge=0, le=100, description="Final risk score (0-100)")
    verdict: str = Field(min_length=1, description="Human-readable risk verdict")
    tier: RiskTier = Field(description="Risk tier: safe | moderate | high | critical")
    reasons: list[str] = Field(
        default_factory=list, description="Explanation strings"
    )
    breakdown: dict[str, Any] | None = Field(
        default=None, description="Component score breakdown"
    )
    created_at: datetime = Field(description="UTC timestamp when the event was created")

    @field_validator("score", mode="before")
    @classmethod
    def coerce_score(cls, v: float) -> float:
        """Ensure score is a float in 0-100."""
        if isinstance(v, (int, float)):
            return max(0.0, min(100.0, float(v)))
        return v

    @field_validator("reasons", mode="before")
    @classmethod
    def ensure_reasons_list(cls, v: list[str]) -> list[str]:
        """Guarantee reasons is always a list (never None)."""
        if v is None:
            return []
        return v

    model_config = {"from_attributes": True}


class EventListResponse(BaseModel):
    """Paginated list of events for the dashboard."""

    events: list[EventResponse] = Field(description="List of event records")
    total: int = Field(
        ge=0, description="Total number of events matching the query"
    )
