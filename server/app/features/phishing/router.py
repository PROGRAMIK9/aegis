from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.features.phishing.schemas import PhishingCheckRequest, PhishingScoreResponse
from app.features.phishing.service import score_phishing_service

router = APIRouter()

@router.post("/check", response_model=PhishingScoreResponse)
def check_phishing(req: PhishingCheckRequest, db: Session = Depends(get_db)):
    return score_phishing_service(db, req.url, req.page_text)
