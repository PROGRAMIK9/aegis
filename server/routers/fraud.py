"""
Aegis Backend — Fraud Score Router
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.fraud import FraudScoreRequest, FraudScoreResponse
from services.scoring import score_fraud_request
from services.event_logger import log_event

router = APIRouter(prefix="/fraud", tags=["Fraud"])


@router.post("/score", response_model=FraudScoreResponse)
async def fraud_score(
    req: FraudScoreRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Score a transaction for fraud risk.

    Pipeline: Rule Engine → Isolation Forest Anomaly Detection → Score Fusion
    """
    txn = req.transaction

    try:
        result = score_fraud_request(
            amount=txn.amount,
            velocity=txn.velocity,
            hour=txn.hour,
            geo_distance=txn.geo_distance,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring engine error: {str(e)}")

    event = await log_event(
        db=db,
        event_type="fraud",
        input_data=req.model_dump(),
        result=result,
    )

    return FraudScoreResponse(
        event_id=event.id,
        **result.model_dump(),
    )
