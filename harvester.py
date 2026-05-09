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
    if not SUPABASE_URL or not SUPABASE_KEY:
        return []
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    try:
        res = requests.get(f"{SUPABASE_URL}/rest/v1/{table}?select=*", headers=headers, timeout=15)
        return res.json() if res.status_code == 200 else []
    except Exception as e:
        print(f"⚠️ Supabase fetch error: {e}")
        return []

def search_tavily(query):
    url = "https://api.tavily.com/search"
    payload = {"api_key": TAVILY_API_KEY, "query": query, "search_depth": "basic", "max_results": 5}
    try:
        response = requests.post(url, json=payload, timeout=20)
        return response.json().get("results", [])
    except Exception as e:
        print(f"⚠️ Tavily search error for '{query}': {e}")
        return []

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are a data extraction expert. Return ONLY valid JSON. All fields must be clean strings."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"}
    }
    try:
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=30)
        if response.status_code != 200:
            print(f"⚠️ OpenAI API error {response.status_code}: {response.text[:200]}")
            return None
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"⚠️ call_ai error: {e}")
        return None

def clean_name(name):
    """Strips version numbers and junk like [object Object], but preserves hyphens and dots."""
    if not name or not isinstance(name, str):
        return "Unknown AI"
    name = re.sub(r'v\d+(\.\d+)*', '', name)           # Remove v1.0, v2 etc
    name = re.sub(r'[^a-zA-Z0-9\s\.\-]', '', name)     # Keep hyphens & dots (GPT-4o, Claude 3.5)
    return name.strip()

def is_real_url(url):
    """Checks if the site is reachable. Accepts any non-error HTTP response (<400)."""
    u = str(url or "").strip()
    if not u or u.lower() == "n/a" or "." not in u:
        return False
    if not u.startswith("http"):
        u = "https://" + u
    try:
        response = requests.get(u, timeout=5, allow_redirects=True,
                                headers={'User-Agent': 'Mozilla/5.0'})
        return response.status_code < 400
    except Exception as e:
        print(f"⚠️ URL check failed for {u}: {e}")
        return False

def main():
    print("🚀 Starting Harvest...")

    # 1. LOAD DATABASE
    database = {}
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            try:
                for item in json.load(f):
                    name = clean_name(item.get('tool_name'))
                    database[name] = item
            except Exception as e:
                print(f"⚠️ Could not load ai_deals.json: {e}")

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

    # 3. PROACTIVE SCOUTING
    priority_categories = [
        "Music AI", "Legal AI", "Medical AI", "Industrial AI", "Video AI",
        "Writing AI", "Marketing AI", "SEO AI", "Image AI", "Coding AI",
        "Search AI", "Voice AI", "No-Code AI"
    ]
    existing_categories = list(set([
        item.get('category') for item in database.values() if item.get('category')
    ]))
    all_targets_cats = list(set(priority_categories + existing_categories))
    print("Proactively scouting high-value niches...")

    # 4. HUNT & UPDATE
    priority_tools = ["Claude", "ChatGPT", "Midjourney", "ElevenLabs", "HeyGen", "Perplexity"]
    targets = list(set(priority_tools + all_targets_cats))

    for target in targets:
        print(f"🔍 Searching: {target}")
        results = search_tavily(f"best {target} AI tools deals and active promo codes 2026 including simplycodes links")

        # Format search results to inject into the prompt
        results_text = "\n".join([
            f"- {r.get('title', '')}: {r.get('url', '')} — {r.get('content', '')[:200]}"
            for r in results
        ]) if results else "No search results found."

        prompt = f"""
You are given real search results about '{target}'. Extract deal information from them.

Search Results:
{results_text}

Return a JSON object with a 'tools' array. Each item must have these fields:
{{"tools": [
  {{"tool_name": "...", "tool_url": "...", "code": "...", "discount_amount": "...",
    "pricing_info": "...", "key_features": "...", "description": "...", "category": "..."}}
]}}

Rules:
1. Tool name must be a simple string (e.g. "Midjourney", "ElevenLabs").
2. Description must be informative (Wikipedia style, 1-2 sentences).
3. Category must be one of: {all_targets_cats}.
4. Only include tools you can identify from the search results above.
5. If no promo code is found, set "code" to "N/A".
"""

        raw = call_ai(prompt)
        if raw:
            try:
                found = json.loads(raw).get('tools', [])
                for t in found:
                    name = clean_name(t.get('tool_name'))
                    if not name or name == "Unknown AI":
                        continue
                    if is_real_url(t.get('tool_url')):
                        database[name] = t
                    else:
                        print(f"🛡️ Skipping {name} — URL not reachable.")
            except Exception as e:
                print(f"⚠️ Failed to parse AI response for '{target}': {e}")
                continue

    # 5. SAVE
    with open("ai_deals.json", "w") as f:
        json.dump(list(database.values()), f, indent=4)
    print(f"✅ Harvest finished. {len(database)} deals saved.")

if __name__ == "__main__":
    main()
