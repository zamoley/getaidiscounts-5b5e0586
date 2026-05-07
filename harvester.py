import os
import json
import requests
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
    results = search_tavily("top trending AI tool categories 2026")
    context = "\n".join([r['content'] for r in results])
    prompt = f"Based on: {context}\nReturn JSON: {{'categories': ['Cat1', 'Cat2', ...]}}"
    res = call_ai(prompt)
    try: return json.loads(res).get('categories', ["Video AI", "Voice AI", "AI Writing", "Coding AI"])
    except: return ["Video AI", "Voice AI", "AI Writing", "Coding AI"]

def main():
    database = []
    categories = discover_categories()
    for cat in categories:
        tools_found = search_tavily(f"best {cat} tools 2026")
        target_tools = [r['title'].split('-')[0].split('|')[0].strip() for r in tools_found[:3]]
        for tool in target_tools:
            if not tool or len(tool) < 2: continue
            search_results = search_tavily(f"'{tool}' discount promo code 2026")
            context = "\n".join([f"- {r['content']}" for r in search_results])
            prompt = f"Extract details for '{tool}' from: {context}. Return JSON with keys: tool_name, tool_url, code, discount_amount, pricing_info, key_features, description. Rules: Official URL only. Strings only, no objects."
            raw_data = call_ai(prompt)
            if raw_data:
                try:
                    data = json.loads(raw_data)
                    # --- DATA FLATTENING ---
                    for key in data:
                        if isinstance(data[key], (dict, list)):
                            data[key] = str(data[key][key]) if isinstance(data[key], dict) and key in data[key] else str(data[key])
                    database.append(data)
                except: continue

    # Merge and Clean Existing
    final_data = []
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            existing = json.load(f)
            # Re-clean existing data to fix old errors
            for item in existing:
                clean_item = {k: (str(v[k]) if isinstance(v, dict) and k in v else str(v)) for k, v in item.items()}
                final_data.append(clean_item)
    
    # Add new, deduplicate
    names = [d['tool_name'] for d in final_data]
    for d in database:
        if d['tool_name'] not in names: final_data.append(d)

    with open("ai_deals.json", "w") as f:
        json.dump(final_data, f, indent=4)

if __name__ == "__main__":
    main()
