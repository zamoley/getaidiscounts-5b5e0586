import os
import json
import requests
import re
from datetime import datetime

TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

def search_tavily(query):
    url = "https://api.tavily.com/search"
    payload = {"api_key": TAVILY_API_KEY, "query": query, "search_depth": "basic", "max_results": 5}
    try:
        response = requests.post(url, json=payload, timeout=15)
        return response.json().get("results", [])
    except: return []

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "user", "content": prompt}], "response_format": {"type": "json_object"}}
    try:
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=30)
        return response.json()['choices'][0]['message']['content']
    except: return None

def discover_categories():
    """Scouts for 10-12 trending AI niches (Legal, Music, Medical, etc.)"""
    print("Scouting for new AI trends...")
    results = search_tavily("hottest trending AI tool categories May 2026")
    context = "\n".join([r['content'] for r in results])
    prompt = f"Based on: {context}\nReturn JSON list of 12 diverse AI categories. Format: {{'categories': ['Cat1', 'Cat2', ...]}}"
    res = call_ai(prompt)
    try: return json.loads(res).get('categories', ["Music AI", "Legal AI", "Video AI", "Voice AI", "Medical AI"])
    except: return ["Music AI", "Legal AI", "Video AI", "Voice AI", "Medical AI"]

def clean_value(key, val):
    """Ensures everything is a clean string and fixes the 'Ghost Name' bug."""
    if val is None: return "N/A"
    s_val = str(val).strip()
    # Fix the 'Ghost Name' (Objects disguised as strings)
    if s_val.startswith("{") or s_val.startswith("[") or len(s_val) > 100:
        if key == "tool_name":
            match = re.search(r"['\"]name['\"]:\s*['\"]([^'\"]+)['\"]", s_val)
            return match.group(1) if match else "AI Tool"
        return "N/A"
    # Filter out common placeholders
    placeholders = ["official_url", "code_or_null", "null", "none", "http://", "https://"]
    if s_val.lower() in placeholders or len(s_val) < 2: return "N/A"
    return s_val

def normalize(name):
    """Removes symbols and 'AI' to find hidden duplicates."""
    return re.sub(r'[^a-z0-9]', '', str(name).lower().replace('ai', ''))

def main():
    database = {}
    # 1. Load & Clean Existing Data
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            try:
                existing = json.load(f)
                for item in existing:
                    key = normalize(item.get('tool_name'))
                    database[key] = {k: clean_value(k, v) for k, v in item.items()}
            except: pass

    # 2. Dynamic Discovery & Harvesting
    categories = discover_categories()
    for cat in categories:
        print(f"Hunting in: {cat}...")
        tools = search_tavily(f"best {cat} tools with discount codes 2026")
        target_names = [r['title'].split('-')[0].split('|')[0].strip() for r in tools[:2]]
        for name in target_names:
            if not name or len(name) < 2: continue
            key = normalize(name)
            # Only search if it's a new tool or the current one is broken (N/A)
            if key not in database or database[key].get('tool_url') == "N/A":
                res = search_tavily(f"'{name}' official website and promo code 2026")
                ctx = "\n".join([r['content'] for r in res])
                prompt = f"Extract details for '{name}' in '{cat}' from: {ctx}. Return JSON. Official URL only. Strings only."
                raw = call_ai(prompt)
                if raw:
                    try:
                        data = json.loads(raw)
                        database[key] = {k: clean_value(k, v) for k, v in data.items()}
                        database[key]['category'] = cat # Ensure category matches search
                    except: continue

    # 3. Final Save (Deduplicated & Clean)
    with open("ai_deals.json", "w") as f:
        json.dump(list(database.values()), f, indent=4)
    print(f"Success! Database has {len(database)} unique, clean tools.")

if __name__ == "__main__":
    main()
