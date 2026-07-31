from sqlalchemy.orm import Session
from app.features.phishing.models import PhishingEvent
import json

class PhishingRepository:
    def create(self, db: Session, url: str, text: str, result: dict):
        db_event = PhishingEvent(
            input_url=url,
            input_text=text,
            final_score=result["final_score"],
            verdict=result["verdict"],
            reasons_jsonb=json.dumps(result["reasons"])
        )
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        return db_event

phishing_repo = PhishingRepository()
