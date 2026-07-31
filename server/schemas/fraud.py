"""
Aegis Backend — Fraud Endpoint Schemas
"""

from typing import Annotated

from pydantic import BaseModel, Field, field_validator, model_validator

from .common import ScoreResult


class Transaction(BaseModel):
    """Transaction payload for fraud scoring."""

    amount: Annotated[
        float,
        Field(
            gt=0,
            le=1_000_000,
            description="Transaction amount in USD (max $1,000,000)",
        ),
    ]
    velocity: Annotated[
        int,
        Field(
            ge=0,
            le=1000,
            description="Number of transactions in the last hour (0-1000)",
        ),
    ]
    hour: Annotated[
        int,
        Field(ge=0, le=23, description="Hour of day the transaction occurred (0-23)"),
    ]
    geo_distance: Annotated[
        float,
        Field(
            ge=0,
            le=40_075,
            description="Distance in km from user's usual location (max ≈ Earth circumference)",
        ),
    ]

    @field_validator("amount", mode="before")
    @classmethod
    def coerce_amount(cls, v: float) -> float:
        """Ensure amount is a valid positive number."""
        if isinstance(v, (int, float)):
            v = float(v)
            if v != v:  # NaN check
                raise ValueError("Amount must be a valid number, not NaN")
        return v

    @field_validator("geo_distance", mode="before")
    @classmethod
    def coerce_geo_distance(cls, v: float) -> float:
        """Ensure geo_distance is a valid non-negative number."""
        if isinstance(v, (int, float)):
            v = float(v)
            if v != v:  # NaN check
                raise ValueError("Geo distance must be a valid number, not NaN")
        return v

    @model_validator(mode="after")
    def flag_impossible_velocity(self) -> "Transaction":
        """
        Business rule: > 500 txns/hr combined with > $100k amount
        is physically implausible (potential API abuse).
        """
        if self.velocity > 500 and self.amount > 100_000:
            raise ValueError(
                "Implausible combination: >500 txn/hr with >$100k amount per txn. "
                "Check for API abuse or data entry error."
            )
        return self

    model_config = {
        "str_strip_whitespace": True,
        "json_schema_extra": {
            "examples": [
                {
                    "amount": 12500.0,
                    "velocity": 25,
                    "hour": 3,
                    "geo_distance": 6000.0,
                }
            ]
        },
    }


class FraudScoreRequest(BaseModel):
    """Request body for POST /fraud/score"""

    transaction: Transaction


class FraudScoreResponse(ScoreResult):
    """Response body for POST /fraud/score"""

    event_id: int = Field(
        gt=0, description="Audit trail event ID for this check"
    )
