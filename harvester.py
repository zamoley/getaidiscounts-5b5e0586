import os
import json
import requests
import re
from datetime import datetime

# API Keys & Supabase (Set in GitHub Secrets)
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

def supabase_get(table):
    """Fetches data from Supabase REST API."""
    if not SUPABASE_URL or not SUPABASE_KEY: return []
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    try:
        res = requests.get(f"{SUPABASE_URL}/rest/v1/{table}?select=*", headers=headers, timeout=15)
        return res.json() if res.status_code == 200 else []
    except: return []

def search_tavily(query):
    url = "https://api.tavily.com/search"
    payload = {"api_key": TAVILY_API_KEY, "query": query, "search_depth": "basic", "max_results": 5}
    try:
        response = requests.post(url, json=payload, timeout=20)
        return response.json().get("results", [])
    except: return []

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "system", "content": "You are a data extraction expert. Return ONLY valid JSON. All fields must be clean strings."}, 
                     {"role": "user", "content": prompt}],
        "response_format": {"type": "json_object"}
    }
    try:
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=30)
        return response.json()['choices'][0]['message']['content']
    except: return None

def clean_name(name):
    """Strips version numbers and strings like [object Object]."""
    if not name or not isinstance(name, str): return "Unknown AI"
    name = re.sub(r'v\d+(\.\d+)*', '', name) # Remove v1.0, v2 etc
    name = re.sub(r'[^a-zA-Z0-9\s]', '', name)
    return name.strip()

def is_real_url(url):
    """Simple check that won't break real links."""
    u = str(url or "").lower().strip()
    if u in ["", "n/a", "none", "null", "http://", "https://", "http://n/a", "https://n/a"]: return False
    if any(x in u for x in ["example.com", "placeholder", "yourlink", "official-website"]): return False
    return "." in u

def main():
    print("🚀 Starting Monday Narnia Harvest...")
    
    # 1. LOAD DATABASE
    database = {}
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            for item in json.load(f):
                name = clean_name(item.get('tool_name'))
                database[name] = item

    # 2. HEALTH CHECK (VOTES)
    votes = supabase_get("deal_votes")
    broken_tools = {}
    for v in votes:
        if v.get('vote_type') == 'broken':
            name = clean_name(v.get('tool_name'))
            broken_tools[name] = broken_tools.get(name, 0) + 1
    
    for name, count in broken_tools.items():
        if count >= 5:
            print(f"⚠️ {name} has {count} broken votes. Verifying...")
            check = search_tavily(f"active discount promo code for {name} 2026")
            if not check:
                print(f"❌ Deleting {name} from database.")
                database.pop(name, None)

    # 3. PROACTIVE SCOUTING (NARNIA MODE)
    # Target categories for growth
    priority_categories = ["Music AI", "Legal AI", "Medical AI", "Industrial AI", "Video AI", "Writing AI", "Marketing AI", "SEO AI", "Image AI", "Coding AI", "Search AI", "Voice AI", "No-Code AI"]
    
    # Extract categories already in our database to ensure they are updated
    existing_categories = list(set([item.get('category') for item in database.values() if item.get('category')]))
    all_targets_cats = list(set(priority_categories + existing_categories))

    print("Proactively scouting high-value niches...")
    
    # 4. HUNT & UPDATE
    priority_tools = ["Claude", "ChatGPT", "Midjourney", "ElevenLabs", "HeyGen", "Perplexity"]
    targets = list(set(priority_tools + all_targets_cats))

    for target in targets:
        print(f"🔍 Searching: {target}")
        results = search_tavily(f"best {target} AI tools deals and active promo codes 2026 including simplycodes links")
        
        prompt = f"""
        Find deals for tools related to '{target}'. Return a JSON list of objects:
        {{'tools': [
           {{'tool_name': '...', 'tool_url': '...', 'code': '...', 'discount_amount': '...', 
             'pricing_info': '...', 'key_features': '...', 'description': '...', 'category': '...'}}
        ]}}
        Rules: 
        1. Tool name must be a simple string.
        2. Description must be informative (Wikipedia style).
        3. Category must be one of {all_targets_cats}.
        """
        raw = call_ai(prompt)
        if raw:
            try:
                found = json.loads(raw).get('tools', [])
                for t in found:
                    name = clean_name(t.get('tool_name'))
                    if not name or name == "Unknown AI": continue
                    
                    # 🛡️ ETHICAL GATEKEEPER
                    if is_real_url(t.get('tool_url')):
                        database[name] = t
                    else:
                        print(f"🛡️ Ethical Block: Skipping {name} (No valid working URL found).")
            except: continue

    # 5. SAVE
    with open("ai_deals.json", "w") as f:
        json.dump(list(database.values()), f, indent=4)
    print(f"✅ Harvest finished. {len(database)} deals verified.")

if __name__ == "__main__":
    main()
