import os
import requests
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "ollama")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")

def analyze_text_with_llm(text_content: str) -> dict:
    """
    Calls the configured LLM to analyze the page text or email body
    for phishing cues (urgency, impersonation, tone).
    Returns a dictionary with 'llm_score' and 'llm_reason'.
    """
    if not text_content or len(text_content.strip()) < 10:
        return {"llm_score": 0, "llm_reason": "Not enough text to analyze."}

    prompt = f"""
    You are an expert cybersecurity AI. Analyze the following text (from an email or website) for phishing indicators.
    Look for:
    1. Unreasonable sense of urgency.
    2. Requests for sensitive information (passwords, SSN).
    3. Impersonation of authority (banks, IT support, executives).
    4. Poor grammar or unprofessional tone mixed with professional claims.

    Provide your assessment in the following exact JSON format without any markdown or extra text:
    {{
        "threat_score": <integer from 0 to 100, where 100 is definite phishing>,
        "explanation": "<a concise 1-2 sentence explanation of why>"
    }}

    Text to analyze:
    "{text_content}"
    """

    if LLM_PROVIDER.lower() == "gemini":
        try:
            client = genai.Client() # Uses GEMINI_API_KEY from env
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    response_mime_type="application/json",
                )
            )
            data = json.loads(response.text)
            return {
                "llm_score": data.get("threat_score", 0),
                "llm_reason": data.get("explanation", "Analyzed by Gemini.")
            }
        except Exception as e:
            return {"llm_score": 0, "llm_reason": f"Gemini API error: {str(e)}"}

    else:
        # Default to Ollama
        try:
            payload = {
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "format": "json"
            }
            res = requests.post(OLLAMA_URL, json=payload, timeout=120)
            res.raise_for_status()
            response_json = res.json()
            # Ollama with format="json" tries to guarantee JSON output
            raw_text = response_json.get("response", "{}").strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1].split("```")[0].strip()
            
            data = json.loads(raw_text)
            return {
                "llm_score": data.get("threat_score", 0),
                "llm_reason": data.get("explanation", "Analyzed by Ollama.")
            }
        except Exception as e:
            print(f"Ollama error: {e}")
            return {"llm_score": 0, "llm_reason": f"Ollama local API error: {str(e)}"}
