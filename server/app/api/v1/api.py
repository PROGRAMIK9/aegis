from fastapi import APIRouter
from app.features.phishing.router import router as phishing_router
from app.features.fraud.router import router as fraud_router
from app.features.events.router import router as events_router

api_router = APIRouter()
api_router.include_router(phishing_router, prefix="/phishing", tags=["phishing"])
api_router.include_router(fraud_router, prefix="/fraud", tags=["fraud"])
api_router.include_router(events_router, prefix="/events", tags=["events"])
