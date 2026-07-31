from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.features.phishing.models import PhishingEvent
from app.features.fraud.models import FraudEvent
from typing import List, Dict, Any

router = APIRouter(tags=["Events"])

@router.get("/events")
def list_events(
    type: str | None = Query(default=None, description="Filter by event type: phishing | fraud"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db)
):
    """Retrieve recent events for the dashboard live feed."""
    events: List[Dict[str, Any]] = []
    
    if type is None or type == "phishing":
        phishing_db = db.query(PhishingEvent).order_by(PhishingEvent.created_at.desc()).all()
        for e in phishing_db:
            events.append({
                "id": f"p_{e.id}",
                "type": "phishing",
                "score": e.final_score,
                "tier": e.verdict,
                "created_at": e.created_at
            })
            
    if type is None or type == "fraud":
        fraud_db = db.query(FraudEvent).order_by(FraudEvent.created_at.desc()).all()
        for e in fraud_db:
            events.append({
                "id": f"f_{e.id}",
                "type": "fraud",
                "score": e.final_score,
                "tier": e.verdict,
                "created_at": e.created_at
            })
            
    # Sort combined events by created_at descending
    events.sort(key=lambda x: x["created_at"], reverse=True)
    
    # Paginate
    paginated_events = events[offset : offset + limit]
    
    return {
        "events": paginated_events,
        "total": len(events)
    }
