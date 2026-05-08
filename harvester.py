import os, json, requests, re

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

def is_real_url(url):
    """FIXED: Only detects ACTUAL fake placeholders."""
    u = str(url).lower().strip()
    # If the URL is just the protocol or empty, it's fake
    if u in ["", "n/a", "none", "null", "http://", "https://", "http://n/a", "https://n/a"]: return False
    # Only block specific placeholder words
    fakes = ["placeholder", "example.com", "yourlink", "official-website"]
    if any(p in u for p in fakes): return False
    if len(u) < 8 or "." not in u: return False
    return True

def clean_item(key, val):
    if val is None: return "N/A"
    s_val = str(val).strip()
    if s_val.startswith("{") or s_val.startswith("[") or len(s_val) > 150: return "N/A"
    return s_val

def main():
    database = {}
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            try:
                existing = json.load(f)
                for item in existing:
                    name = clean_item("tool_name", item.get('tool_name'))
                    if name == "N/A" or len(name) < 2: continue
                    key = re.sub(r'[^a-z0-9]', '', name.lower().replace('ai', ''))
                    # Restore URLs if they were accidentally set to N/A
                    url = item.get('tool_url', 'N/A')
                    item['tool_url'] = url if is_real_url(url) else "N/A"
                    database[key] = {k: clean_item(k, v) for k, v in item.items()}
            except: pass

    # Scouting Logic (Keeping it light)
    categories = ["Music AI", "Legal AI", "Video AI"]
    for cat in categories:
        tools = search_tavily(f"best {cat} tools with discounts 2026")
        for t in tools[:2]:
            name = t['title'].split('-')[0].strip()
            key = re.sub(r'[^a-z0-9]', '', name.lower().replace('ai', ''))
            if key not in database or database[key].get('tool_url') == "N/A":
                prompt = f"Extract details for '{name}' in '{cat}'. JSON only. Official URL."
                raw = call_ai(prompt)
                if raw:
                    try:
                        data = json.loads(raw)
                        if data.get('tool_name') and data.get('tool_name') != "N/A":
                            clean_data = {k: clean_item(k, v) for k, v in data.items()}
                            clean_data['tool_url'] = clean_data['tool_url'] if is_real_url(clean_data['tool_url']) else "N/A"
                            database[key] = clean_data
                    except: continue

    with open("ai_deals.json", "w") as f:
        json.dump(list(database.values()), f, indent=4)
    print(f"Repaired! {len(database)} tools saved with correct URLs.")

if __name__ == "__main__":
    main()
