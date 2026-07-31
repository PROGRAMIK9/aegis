from pydantic import BaseModel
from typing import Optional, List, Dict

class PhishingCheckRequest(BaseModel):
    url: str
    page_text: Optional[str] = None

class PhishingScoreResponse(BaseModel):
    final_score: int
    verdict: str
    reasons: List[str]
    breakdown: Dict[str, int]
