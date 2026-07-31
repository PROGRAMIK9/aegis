"""
Aegis Backend — Event ORM Model

Stores every phishing check and fraud score as an audit trail entry.
"""

from datetime import datetime, timezone
from sqlalchemy import JSON, DateTime, Float, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    type: Mapped[str] = mapped_column(String(16), nullable=False, index=True)  # "phishing" | "fraud"
    input_data: Mapped[dict] = mapped_column(JSON, nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    verdict: Mapped[str] = mapped_column(String(32), nullable=False)
    tier: Mapped[str] = mapped_column(String(16), nullable=False)
    reasons: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    breakdown: Mapped[dict] = mapped_column(JSON, nullable=True, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )

    # Composite index for dashboard queries: recent events by type
    __table_args__ = (
        Index("ix_events_type_created", "type", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Event id={self.id} type={self.type} score={self.score} verdict={self.verdict}>"
