from app.common.rule_engine import rule_check_phishing
from app.features.phishing.phishing_ml import predict_phishing_ml
from app.integrations.llm import analyze_text_with_llm
from app.features.phishing.repository import phishing_repo
from sqlalchemy.orm import Session

def score_phishing_service(db: Session, url: str, text_content: str = None) -> dict:
    rule_res = rule_check_phishing(url)
    ml_res = predict_phishing_ml(url)
    
    llm_res = {"llm_score": 0, "llm_reasons": []}
    if text_content:
        llm_analysis = analyze_text_with_llm(text_content)
        llm_res["llm_score"] = llm_analysis["llm_score"]
        if llm_analysis.get("llm_reason"):
             llm_res["llm_reasons"] = [llm_analysis["llm_reason"]]
             
    if text_content:
        final_score = int((rule_res["rule_score"] * 0.3) + (ml_res["ml_score"] * 0.4) + (llm_res["llm_score"] * 0.3))
    else:
        final_score = int((rule_res["rule_score"] * 0.4) + (ml_res["ml_score"] * 0.6))
        
    all_reasons = rule_res["rule_reasons"] + ml_res["ml_reasons"] + llm_res.get("llm_reasons", [])
    
    if final_score > 75: verdict = "CRITICAL_RISK"
    elif final_score > 40: verdict = "MODERATE_RISK"
    else: verdict = "SAFE"
        
    result = {
        "final_score": final_score,
        "verdict": verdict,
        "reasons": all_reasons,
        "breakdown": {
            "rule_score": rule_res["rule_score"],
            "ml_score": ml_res["ml_score"],
            "llm_score": llm_res.get("llm_score", 0)
        }
    }
    
    phishing_repo.create(db, url, text_content, result)
    return result
