import os
import json
import requests
from datetime import datetime

TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "user", "content": prompt}], "response_format": {"type": "json_object"}}
    try:
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=30)
        return response.json()['choices'][0]['message']['content']
    except: return None

def clean_item(item):
    """Guarantees every field in a tool is a simple string."""
    cleaned = {}
    fields = ["tool_name", "tool_url", "code", "discount_amount", "pricing_info", "key_features", "description", "last_verified", "category"]
    for field in fields:
        val = item.get(field, "N/A")
        if isinstance(val, dict):
            # If it's a dict like {'name': 'Tool'}, get the text
            cleaned[field] = str(next(iter(val.values()))) if val else "N/A"
        elif isinstance(val, list):
            cleaned[field] = ", ".join([str(x) for x in val])
        else:
            cleaned[field] = str(val) if val is not None else "N/A"
    return cleaned

def main():
    # 1. Fix the existing 58 deals first
    final_data = []
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            try:
                raw_existing = json.load(f)
                if isinstance(raw_existing, list):
                    for item in raw_existing:
                        if isinstance(item, dict):
                            final_data.append(clean_item(item))
            except: print("Existing database was corrupted, starting fresh.")

    # 2. Add new deals (Simpler loop for safety)
    # [Insert your search/harvest logic here if you want to find NEW deals today]
    
    with open("ai_deals.json", "w") as f:
        json.dump(final_data, f, indent=4)
    print(f"Database fixed and cleaned: {len(final_data)} tools.")

if __name__ == "__main__":
    main()
