from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.features.fraud.schemas import FraudScoreRequest, FraudScoreResponse
from app.features.fraud.service import score_transaction_service

router = APIRouter()

@router.post("/score", response_model=FraudScoreResponse)
def check_fraud(req: FraudScoreRequest, db: Session = Depends(get_db)):
    txn = req.transaction
    return score_transaction_service(db, txn.amount, txn.velocity, txn.hour, txn.geo_distance)
