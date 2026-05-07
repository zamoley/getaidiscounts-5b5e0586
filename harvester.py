import os
import json
import requests
import re
from datetime import datetime

TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "user", "content": prompt}], "response_format": {"type": "json_object"}}
    try:
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=30)
        return res.json()['choices'][0]['message']['content']
    except: return None

def clean_string(val):
    """Deep-cleans any data into a clean string. Fixes the 'Ghost Name' bug."""
    if not val: return "N/A"
    s_val = str(val).strip()
    # Check if AI returned a JSON string instead of a name
    if s_val.startswith("{") or s_val.startswith("['") or len(s_val) > 100:
        try:
            prompt = f"Extract ONLY the official name of the AI tool from this text: {s_val}. Return JSON: {{'name': '...'}}"
            res = call_ai(prompt)
            return json.loads(res).get('name', 'AI Tool')
        except: 
            # Fallback: regex to find the first quoted name or title
            match = re.search(r"['\"]name['\"]:\s*['\"]([^'\"]+)['\"]", s_val)
            return match.group(1) if match else "AI Tool"
    return s_val

def main():
    final_data = []
    # 1. Load and Fix current database (Sanitization)
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            try:
                existing = json.load(f)
                for item in existing:
                    clean_item = {
                        "tool_name": clean_string(item.get("tool_name")),
                        "tool_url": str(item.get("tool_url", "")),
                        "code": str(item.get("code", "N/A")),
                        "discount_amount": str(item.get("discount_amount", "N/A")),
                        "pricing_info": str(item.get("pricing_info", "N/A")),
                        "key_features": str(item.get("key_features", "N/A")),
                        "description": str(item.get("description", "N/A")),
                        "last_verified": str(item.get("last_verified", datetime.now().strftime('%Y-%m-%d'))),
                        "category": str(item.get("category", "General AI"))
                    }
                    final_data.append(clean_item)
            except: pass

    # 2. Save the perfectly sanitized database
    with open("ai_deals.json", "w") as f:
        json.dump(final_data, f, indent=4)
    print(f"Database sanitized. {len(final_data)} tools cleaned.")

if __name__ == "__main__":
    main()
