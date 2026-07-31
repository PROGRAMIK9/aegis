from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.features.auth.models import User
from app.api.deps import get_db, get_optional_user
from app.features.phishing.schemas import PhishingCheckRequest, PhishingScoreResponse
from app.features.phishing.service import score_phishing_service

router = APIRouter()

@router.post("/check", response_model=PhishingScoreResponse)
def check_phishing(
    req: PhishingCheckRequest, 
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    user_id = user.id if user else None
    return score_phishing_service(db, req.url, req.page_text, user_id=user_id, fast_mode=req.fast_mode)

from app.features.phishing.schemas import WhitelistRequest
from app.api.deps import get_current_user
from app.features.phishing.models import UserWhitelist
from urllib.parse import urlparse

@router.post("/whitelist")
def add_to_whitelist(
    req: WhitelistRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    domain = urlparse(req.domain).netloc or req.domain
    # Check if already whitelisted
    existing = db.query(UserWhitelist).filter(
        UserWhitelist.user_id == user.id,
        UserWhitelist.domain == domain
    ).first()
    
    if not existing:
        whitelist_entry = UserWhitelist(user_id=user.id, domain=domain)
        db.add(whitelist_entry)
        db.commit()
    
    return {"status": "success", "message": f"{domain} has been added to your personal whitelist."}
