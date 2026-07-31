"""
Aegis Backend — Phishing Check Router
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.phishing import PhishingCheckRequest, PhishingCheckResponse
from services.scoring import score_phishing_request
from services.event_logger import log_event

router = APIRouter(prefix="/phishing", tags=["Phishing"])


@router.post("/check", response_model=PhishingCheckResponse)
async def phishing_check(
    req: PhishingCheckRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Analyze a URL (and optional page text) for phishing indicators.

    Pipeline: Rule Engine → ML Classifier → LLM Explainer → Score Fusion
    """
    try:
        result = score_phishing_request(req.url, req.page_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring engine error: {str(e)}")

    event = await log_event(
        db=db,
        event_type="phishing",
        input_data=req.model_dump(),
        result=result,
    )

    return PhishingCheckResponse(
        event_id=event.id,
        **result.model_dump(),
    )
