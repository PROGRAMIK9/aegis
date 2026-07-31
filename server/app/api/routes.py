from fastapi import APIRouter
from app.schemas.requests import PhishingCheckRequest, FraudScoreRequest
from app.core.database import log_event
from app.ai.fusion import score_phishing, score_transaction

router = APIRouter()

@router.post("/phishing/check")
def phishing_check(req: PhishingCheckRequest):
    input_data = req.dict()
    result = score_phishing(req.url, req.page_text)
    log_event("phishing", input_data, result)
    return result

@router.post("/fraud/score")
def fraud_score(req: FraudScoreRequest):
    input_data = req.dict()
    txn = req.transaction
    result = score_transaction(txn.amount, txn.velocity, txn.hour, txn.geo_distance)
    log_event("fraud", input_data, result)
    return result
