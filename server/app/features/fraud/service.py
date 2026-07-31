from app.common.rule_engine import rule_check_transaction
from app.features.fraud.fraud_ml import predict_transaction_fraud
from app.features.fraud.repository import fraud_repo
from sqlalchemy.orm import Session

def score_transaction_service(db: Session, amount: float, velocity: int, hour: int, geo_distance: float) -> dict:
    rule_res = rule_check_transaction(amount, velocity, hour, geo_distance)
    ml_res = predict_transaction_fraud(amount, velocity, hour, geo_distance)
    
    final_score = max(rule_res["rule_score"], ml_res["fraud_score"])
    all_reasons = list(dict.fromkeys(rule_res["rule_reasons"] + ml_res["fraud_reasons"]))
    
    if final_score > 80: verdict = "FRAUD"
    elif final_score > 50: verdict = "REVIEW_NEEDED"
    else: verdict = "LEGITIMATE"
        
    result = {
        "final_score": final_score,
        "verdict": verdict,
        "reasons": all_reasons,
        "breakdown": {
            "rule_score": rule_res["rule_score"],
            "ml_score": ml_res["fraud_score"]
        }
    }
    
    txn_data = {"amount": amount, "velocity": velocity, "hour": hour, "geo_distance": geo_distance}
    fraud_repo.create(db, txn_data, result)
    return result
