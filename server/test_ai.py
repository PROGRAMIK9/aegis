import json
from ai.fusion import score_phishing, score_transaction

def run_tests():
    print("Testing Phishing Engine...")
    # Safe URL
    safe_res = score_phishing("https://google.com")
    print("\nSafe URL Result:")
    print(json.dumps(safe_res, indent=2))
    
    # Phishing URL
    phish_res = score_phishing("http://secure-login-paypa1.com.update.pw")
    print("\nPhishing URL Result:")
    print(json.dumps(phish_res, indent=2))
    
    # Phishing URL with text (mock LLM call)
    phish_text = score_phishing(
        "http://secure-login-paypa1.com.update.pw", 
        "Dear customer, your account has been suspended! Please click here to login immediately."
    )
    print("\nPhishing URL + Text Result:")
    print(json.dumps(phish_text, indent=2))

    print("\n--------------------------")
    print("Testing Fraud Engine...")
    
    # Normal transaction
    normal_tx = score_transaction(amount=45.0, velocity=1, hour=14, geo_distance=5.0)
    print("\nNormal Transaction Result:")
    print(json.dumps(normal_tx, indent=2))
    
    # Fraudulent transaction
    fraud_tx = score_transaction(amount=12500.0, velocity=25, hour=3, geo_distance=6000.0)
    print("\nFraudulent Transaction Result:")
    print(json.dumps(fraud_tx, indent=2))

if __name__ == "__main__":
    run_tests()
