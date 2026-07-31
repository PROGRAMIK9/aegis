"""
Aegis Backend — Phishing Endpoint Schemas
"""

from typing import Annotated, Optional

from pydantic import BaseModel, Field, HttpUrl, field_validator

from .common import ScoreResult


class PhishingCheckRequest(BaseModel):
    """Request body for POST /phishing/check"""

    url: Annotated[
        str,
        Field(
            min_length=1,
            max_length=2048,
            description="The URL to analyze for phishing indicators",
        ),
    ]
    page_text: Optional[str] = Field(
        default=None,
        max_length=50_000,
        description="Optional page body text for LLM analysis of phishing language cues",
    )

    @field_validator("url", mode="before")
    @classmethod
    def normalize_url(cls, v: str) -> str:
        """Strip whitespace and ensure the URL is not blank."""
        if isinstance(v, str):
            v = v.strip()
        if not v:
            raise ValueError("URL must not be empty or whitespace-only")
        return v

    @field_validator("url", mode="after")
    @classmethod
    def validate_url_scheme(cls, v: str) -> str:
        """Ensure the URL has a recognisable scheme (http/https/ftp)."""
        lower = v.lower()
        if not any(lower.startswith(s) for s in ("http://", "https://", "ftp://")):
            raise ValueError(
                "URL must start with a valid scheme (http://, https://, or ftp://)"
            )
        return v

    @field_validator("page_text", mode="before")
    @classmethod
    def strip_page_text(cls, v: Optional[str]) -> Optional[str]:
        """Strip leading/trailing whitespace from page_text; convert blank to None."""
        if isinstance(v, str):
            v = v.strip()
            return v if v else None
        return v

    model_config = {
        "str_strip_whitespace": True,
        "json_schema_extra": {
            "examples": [
                {
                    "url": "http://secure-login-paypa1.com.update.pw",
                    "page_text": "Your account has been suspended. Click here to verify immediately.",
                }
            ]
        },
    }


class PhishingCheckResponse(ScoreResult):
    """Response body for POST /phishing/check"""

    event_id: int = Field(
        gt=0, description="Audit trail event ID for this check"
    )
