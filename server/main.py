import sqlite3
import json
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from ai.fusion import score_phishing, score_transaction as ai_score_transaction

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

def get_db():
    conn = sqlite3.connect("events.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

@app.on_event("startup")
def startup_event():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            input_jsonb TEXT NOT NULL,
            score REAL NOT NULL,
            tier TEXT NOT NULL,
            reasons_jsonb TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def log_event(event_type: str, input_data: dict, score_result: dict):
    conn = get_db()
    try:
        conn.execute("""
            INSERT INTO events (type, input_jsonb, score, tier, reasons_jsonb, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            event_type,
            json.dumps(input_data),
            score_result.get("final_score", 0),
            score_result.get("verdict", "UNKNOWN"),
            json.dumps(score_result.get("reasons", [])),
            datetime.now().isoformat()
        ))
        conn.commit()
    finally:
        conn.close()

@app.get("/")
def home():
    return {"message": "Hello from ABBS AI Backend!"}

@app.post("/phishing/check")
def phishing_check(req: PhishingCheckRequest):
    input_data = req.dict()
    result = score_phishing(req.url, req.page_text)
    log_event("phishing", input_data, result)
    return result

@app.post("/fraud/score")
def fraud_score(req: FraudScoreRequest):
    input_data = req.dict()
    txn = req.transaction
    result = ai_score_transaction(txn.amount, txn.velocity, txn.hour, txn.geo_distance)
    log_event("fraud", input_data, result)
    return result
