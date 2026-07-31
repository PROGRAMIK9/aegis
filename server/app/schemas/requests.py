from pydantic import BaseModel
from typing import Optional

class PhishingCheckRequest(BaseModel):
    url: str
    page_text: Optional[str] = None

class Transaction(BaseModel):
    amount: float
    velocity: int
    hour: int
    geo_distance: float

class FraudScoreRequest(BaseModel):
    transaction: Transaction
