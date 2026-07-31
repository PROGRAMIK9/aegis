from pydantic import BaseModel
from typing import List, Dict

class Transaction(BaseModel):
    amount: float
    velocity: int
    hour: int
    geo_distance: float

class FraudScoreRequest(BaseModel):
    transaction: Transaction

class FraudScoreResponse(BaseModel):
    final_score: int
    verdict: str
    reasons: List[str]
    breakdown: Dict[str, int]
