from .rule_engine import rule_check_phishing, rule_check_transaction
from .phishing_ml import predict_phishing_ml
from .fraud_ml import predict_transaction_fraud
from .llm_explainer import analyze_text_with_llm

def score_phishing(url: str, text_content: str = None) -> dict:
    """
    Fuses Rules, ML, and LLM to compute a final phishing risk score.
    """
    # 1. Rules
    rule_res = rule_check_phishing(url)
    
    # 2. ML Classifier
    ml_res = predict_phishing_ml(url)
    
    # 3. LLM (only if text is provided)
    llm_res = {"llm_score": 0, "llm_reasons": []}
    if text_content:
        llm_analysis = analyze_text_with_llm(text_content)
        llm_res["llm_score"] = llm_analysis["llm_score"]
        if llm_analysis.get("llm_reason"):
             llm_res["llm_reasons"] = [llm_analysis["llm_reason"]]
             
    # 4. Fusion Logic
    # Weights: Rules 30%, ML 40%, LLM 30% (if text present)
    # If no text: Rules 40%, ML 60%
    if text_content:
        weighted_score = (rule_res["rule_score"] * 0.3) + (ml_res["ml_score"] * 0.4) + (llm_res["llm_score"] * 0.3)
    else:
        weighted_score = (rule_res["rule_score"] * 0.4) + (ml_res["ml_score"] * 0.6)
        
    # In security scoring, strong individual signals shouldn't be diluted by a weighted average.
    # We take the maximum of any individual component score or the weighted average.
    max_score = max(rule_res["rule_score"], ml_res["ml_score"], llm_res.get("llm_score", 0))
    final_score = int(max(weighted_score, max_score))
        
    all_reasons = rule_res["rule_reasons"] + ml_res["ml_reasons"] + llm_res.get("llm_reasons", [])
    
    # Verdict mapping
    if final_score > 75:
        verdict = "CRITICAL_RISK"
    elif final_score > 40:
        verdict = "MODERATE_RISK"
    else:
        verdict = "SAFE"
        
    return {
        "final_score": final_score,
        "verdict": verdict,
        "reasons": all_reasons,
        "breakdown": {
            "rule_score": rule_res["rule_score"],
            "ml_score": ml_res["ml_score"],
            "llm_score": llm_res.get("llm_score", 0)
        }
    }

def score_transaction(amount: float, velocity: int, hour: int, geo_distance: float) -> dict:
    """
    Fuses Rules and ML (Isolation Forest) for transaction fraud scoring.
    """
    # 1. Rules
    rule_res = rule_check_transaction(amount, velocity, hour, geo_distance)
    
    # 2. ML (Anomaly Detection)
    ml_res = predict_transaction_fraud(amount, velocity, hour, geo_distance)
    
    # 3. Fusion Logic
    # Rules often override ML if broken, so we take the max, or a weighted average
    final_score = max(rule_res["rule_score"], ml_res["fraud_score"])
    
    all_reasons = rule_res["rule_reasons"] + ml_res["fraud_reasons"]
    
    # Deduplicate reasons
    all_reasons = list(dict.fromkeys(all_reasons))
    
    if final_score > 80:
        verdict = "FRAUD"
    elif final_score > 50:
        verdict = "REVIEW_NEEDED"
    else:
        verdict = "LEGITIMATE"
        
    return {
        "final_score": final_score,
        "verdict": verdict,
        "reasons": all_reasons,
        "breakdown": {
            "rule_score": rule_res["rule_score"],
            "ml_score": ml_res["fraud_score"]
        }
    }
