from typing import Generator
from app.core.database import SessionLocal

def get_db() -> Generator:
    """Dependency to get the DB session."""
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
