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

def clean_item(item):
    """Guarantees every field is a string and flattens hallucinations."""
    cleaned = {}
    fields = ["tool_name", "tool_url", "code", "discount_amount", "pricing_info", "key_features", "description", "last_verified", "category"]
    for field in fields:
        val = item.get(field, "N/A")
        if isinstance(val, dict):
            cleaned[field] = str(next(iter(val.values()))) if val else "N/A"
        elif isinstance(val, list):
            cleaned[field] = ", ".join([str(x) for x in val])
        else:
            cleaned[field] = str(val) if val is not None else "N/A"
    return cleaned

def main():
    database = []
    # 1. Discover New Categories & Tools
    categories = ["Video AI", "Voice AI", "AI Writing", "Coding AI", "AI Agents", "SEO AI", "Marketing AI"]
    for cat in categories:
        print(f"Searching {cat}...")
        tools = search_tavily(f"best {cat} tools with discount codes 2026")
        target_tools = [r['title'].split('-')[0].split('|')[0].strip() for r in tools[:2]]
        for tool in target_tools:
            if not tool or len(tool) < 2: continue
            search_res = search_tavily(f"'{tool}' promo code 2026")
            context = "\n".join([r['content'] for r in search_res])
            prompt = f"Extract details for '{tool}' from: {context}. Return JSON. Rules: Official URL. Strings only."
            raw = call_ai(prompt)
            if raw:
                try:
                    data = json.loads(raw)
                    database.append(clean_item(data))
                except: continue

    # 2. Merge and Deep Clean Existing 
    final_data = []
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            try:
                existing = json.load(f)
                for item in existing:
                    final_data.append(clean_item(item))
            except: pass

    # 3. Deduplicate and Save
    names = [d['tool_name'] for d in final_data]
    for d in database:
        if d['tool_name'] not in names: final_data.append(d)

    with open("ai_deals.json", "w") as f:
        json.dump(final_data, f, indent=4)
    print(f"Harvest complete. {len(final_data)} tools ready.")

if __name__ == "__main__":
    main()
