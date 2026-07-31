"""
Aegis Backend — Scoring Service

Thin adapter between the FastAPI layer and the AI fusion module.
Translates AI module output into the ScoreResult contract.

This is the ONLY file that touches the ai/ package — if the AI API
changes, only this file needs updating.
"""

from ai.fusion import score_phishing, score_transaction
from schemas.common import ScoreResult, ScoreBreakdown


def _verdict_to_tier(verdict: str) -> str:
    """Map AI verdict strings to standardized tiers."""
    mapping = {
        "SAFE": "safe",
        "LEGITIMATE": "safe",
        "MODERATE_RISK": "moderate",
        "REVIEW_NEEDED": "high",
        "CRITICAL_RISK": "critical",
        "FRAUD": "critical",
    }
    return mapping.get(verdict, "moderate")


def score_phishing_request(url: str, page_text: str | None = None) -> ScoreResult:
    """
    Run the AI phishing pipeline and return a normalized ScoreResult.
    """
    raw = score_phishing(url, page_text)

    breakdown = ScoreBreakdown(
        rule_score=raw["breakdown"]["rule_score"],
        ml_score=raw["breakdown"]["ml_score"],
        llm_score=raw["breakdown"].get("llm_score", 0),
    )

    return ScoreResult(
        score=raw["final_score"],
        verdict=raw["verdict"],
        tier=_verdict_to_tier(raw["verdict"]),
        reasons=raw["reasons"],
        breakdown=breakdown,
    )


def score_fraud_request(
    amount: float, velocity: int, hour: int, geo_distance: float
) -> ScoreResult:
    """
    Run the AI fraud pipeline and return a normalized ScoreResult.
    """
    raw = score_transaction(amount, velocity, hour, geo_distance)

    breakdown = ScoreBreakdown(
        rule_score=raw["breakdown"]["rule_score"],
        ml_score=raw["breakdown"]["ml_score"],
    )

    return ScoreResult(
        score=raw["final_score"],
        verdict=raw["verdict"],
        tier=_verdict_to_tier(raw["verdict"]),
        reasons=raw["reasons"],
        breakdown=breakdown,
    )
