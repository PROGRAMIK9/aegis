import math
import re
from urllib.parse import urlparse
import jellyfish

# Top 50 targeted brands for quick Levenshtein matching
TOP_BRANDS = [
    "paypal", "apple", "microsoft", "netflix", "amazon", "google", 
    "facebook", "bankofamerica", "chase", "wellsfargo", "dhl", "fedex"
]

def shannon_entropy(s: str) -> float:
    """Calculates the Shannon entropy of a string."""
    if not s:
        return 0.0
    prob = [float(s.count(c)) / len(s) for c in dict.fromkeys(list(s))]
    entropy = -sum([p * math.log(p) / math.log(2.0) for p in prob])
    return entropy

def extract_url_features(url: str) -> dict:
    """
    Extracts lexical and structural features from a URL to feed into the ML model.
    """
    features = {}
    
    # 1. Structural features
    parsed = urlparse(url)
    domain = parsed.netloc
    path = parsed.path
    
    features['url_length'] = len(url)
    features['domain_length'] = len(domain)
    features['path_length'] = len(path)
    
    # 2. Character counts and presence
    features['num_dots'] = url.count('.')
    features['num_hyphens'] = url.count('-')
    features['num_at'] = url.count('@')
    features['num_digits'] = sum(c.isdigit() for c in url)
    features['has_https'] = 1 if url.startswith("https://") else 0
    features['has_ip'] = 1 if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', domain) else 0
    
    # 3. Complexity features
    features['entropy'] = shannon_entropy(url)
    features['domain_entropy'] = shannon_entropy(domain)
    
    # 4. Brand impersonation (Levenshtein distance to top brands)
    # E.g., 'paypa1' vs 'paypal' -> distance 1 (suspicious if not exact match)
    min_dist = float('inf')
    brand_match = 0 # 1 if exact, 0 if not
    for brand in TOP_BRANDS:
        if brand in domain.lower():
            if domain.lower() == brand or domain.lower().startswith(brand + "."):
                 brand_match = 1
            else:
                dist = jellyfish.levenshtein_distance(brand, domain.lower())
                if dist < min_dist:
                    min_dist = dist
                    
    features['brand_impersonation_score'] = min_dist if min_dist != float('inf') else 100
    features['exact_brand_match'] = brand_match
    
    return features
