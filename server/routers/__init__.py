from .health import router as health_router
from .phishing import router as phishing_router
from .fraud import router as fraud_router
from .events import router as events_router

__all__ = ["health_router", "phishing_router", "fraud_router", "events_router"]
