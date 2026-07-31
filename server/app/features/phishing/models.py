from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base
from datetime import datetime

class PhishingEvent(Base):
    __tablename__ = "phishing_events"
    id = Column(Integer, primary_key=True, index=True)
    input_url = Column(String, index=True)
    input_text = Column(String, nullable=True)
    final_score = Column(Float)
    verdict = Column(String)
    reasons_jsonb = Column(String) 
    created_at = Column(DateTime, default=datetime.utcnow)
