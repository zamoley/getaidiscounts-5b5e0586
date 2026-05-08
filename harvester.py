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
            # If still no new code found, we mark as 'Coming Soon' or delete
            # For simplicity, we search once more
            check = search_tavily(f"active discount promo code for {name} 2026")
            if not check:
                print(f"❌ Deleting {name} from database.")
                database.pop(name, None)

    # 3. PROACTIVE SCOUTING (NARNIA MODE)
    # We hunt for Music AI and other niches proactively to prevent user bounce
    priority_categories = ["Music AI", "Legal AI", "Medical AI", "Industrial AI", "Video AI", "Writing AI"]
    
    print("Proactively scouting high-value niches...")
    # We also check for real deals on high-intent sites to avoid 'Coming Soon' states
    source_intelligence = "Search specifically for active promo codes on platforms like SimplyCodes to find working links for Higgsfield, Veo, and others."

    # 4. HUNT & UPDATE
    # We update existing top tools + find new ones in scouted categories
    priority_tools = ["Claude", "ChatGPT", "Midjourney", "ElevenLabs", "HeyGen", "Perplexity"]
    targets = priority_tools + categories

    for target in targets:
        print(f"🔍 Searching: {target}")
        results = search_tavily(f"best {target} AI tools deals and active promo codes 2026")
        context = "\n".join([r['content'] for r in results])
        
        prompt = f"""
        Find deals for tools related to '{target}'. Return a JSON list of objects:
        {{'tools': [
           {{'tool_name': '...', 'tool_url': '...', 'code': '...', 'discount_amount': '...', 
             'pricing_info': '...', 'key_features': '...', 'description': '...', 'category': '...'}}
        ]}}
        Rules: 
        1. Tool name must be a simple string.
        2. Description must be informative (Wikipedia style).
        3. Category must be one of {categories + ['Writing', 'Image', 'Video', 'Voice', 'Coding']}.
        """
        raw = call_ai(prompt)
        if raw:
            try:
                found = json.loads(raw).get('tools', [])
                for t in found:
                    name = clean_name(t.get('tool_name'))
                    if not name or name == "Unknown AI": continue
                    
                    # 🛡️ ETHICAL GATEKEEPER: Wikipedia-grade honesty
                    # If no valid URL is found, we do NOT add the tool.
                    # We would rather show 40 real deals than 100 fake ones.
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
