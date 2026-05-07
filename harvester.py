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
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=30)
        return res.json()['choices'][0]['message']['content']
    except: return None

def clean_text(val):
    """The most aggressive cleaner ever made. Fixes the 'Ghost Name' bug."""
    if not val: return "N/A"
    # If the AI accidentally returned a string that LOOKS like a dictionary
    s_val = str(val).strip()
    if s_val.startswith("{") and "name" in s_val.lower():
        try:
            # Try to extract just the name from the ghost string
            prompt = f"Extract ONLY the tool name from this messy string and return as JSON {{'name': '...'}}: {s_val}"
            res = call_ai(prompt)
            return json.loads(res).get('name', 'AI Tool')
        except: return "AI Tool"
    return s_val

def main():
    if not os.path.exists("ai_deals.json"): return
    with open("ai_deals.json", "r") as f:
        existing = json.load(f)

    cleaned_db = []
    for item in existing:
        new_item = {}
        for k, v in item.items():
            new_item[k] = clean_item_value(k, v)
        cleaned_db.append(new_item)

    with open("ai_deals.json", "w") as f:
        json.dump(cleaned_db, f, indent=4)
    print("Database Sanitized!")

def clean_item_value(key, val):
    if key == "tool_name": return clean_text(val)
    if isinstance(val, (dict, list)): return str(val)
    return str(val)

if __name__ == "__main__":
    main()
