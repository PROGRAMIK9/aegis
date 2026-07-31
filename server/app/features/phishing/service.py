from app.common.rule_engine import rule_check_phishing
from app.features.phishing.phishing_ml import predict_phishing_ml
from app.integrations.llm import analyze_text_with_llm
from app.features.phishing.repository import phishing_repo
from sqlalchemy.orm import Session
import requests
import re

def strip_tags(html: str) -> str:
    text = re.sub(r'<[^>]+>', ' ', html)
    return ' '.join(text.split())

def fetch_page_content(url: str) -> str:
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        res = requests.get(url, headers=headers, timeout=5)
        res.raise_for_status()
        return strip_tags(res.text)[:3000]
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return ""

def score_phishing_service(db: Session, url: str, text_content: str = None) -> dict:
    rule_res = rule_check_phishing(url)
    ml_res = predict_phishing_ml(url)
    
    if not text_content:
        fetched = fetch_page_content(url)
        if fetched:
            text_content = fetched

    llm_res = {"llm_score": 0, "llm_reasons": []}
    if text_content:
        llm_analysis = analyze_text_with_llm(text_content)
        llm_res["llm_score"] = llm_analysis["llm_score"]
        if llm_analysis.get("llm_reason"):
             llm_res["llm_reasons"] = [llm_analysis["llm_reason"]]
             
    if text_content:
        weighted_score = (rule_res["rule_score"] * 0.3) + (ml_res["ml_score"] * 0.4) + (llm_res["llm_score"] * 0.3)
    else:
        weighted_score = (rule_res["rule_score"] * 0.4) + (ml_res["ml_score"] * 0.6)
        
    max_score = max(rule_res["rule_score"], ml_res["ml_score"], llm_res.get("llm_score", 0))
    final_score = int(max(weighted_score, max_score))
        
    all_reasons = rule_res["rule_reasons"] + ml_res["ml_reasons"] + llm_res.get("llm_reasons", [])
    
    if final_score > 75: 
        verdict = "CRITICAL_RISK"
        tier = "critical"
    elif final_score > 40: 
        verdict = "MODERATE_RISK"
        tier = "moderate"
    elif final_score > 25:
        verdict = "REVIEW_NEEDED"
        tier = "high"
    else: 
        verdict = "SAFE"
        tier = "safe"
        
    result = {
        "final_score": final_score,
        "verdict": verdict,
        "tier": tier,
        "reasons": all_reasons,
        "breakdown": {
            "rule_score": rule_res["rule_score"],
            "ml_score": ml_res["ml_score"],
            "llm_score": llm_res.get("llm_score", 0)
        }
    }
    
    phishing_repo.create(db, url, text_content, result)
    return result
