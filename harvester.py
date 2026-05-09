import os
import json
import requests
import re

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
    """Search for deals using the Tavily API."""
    url = "https://api.tavily.com/search"
    payload = {"api_key": TAVILY_API_KEY, "query": query, "search_depth": "basic", "max_results": 5}
    try:
        response = requests.post(url, json=payload, timeout=20)
        return response.json().get("results", [])
    except Exception as e:
        print(f"⚠️ Tavily search error for '{query}': {e}")
        return []


def call_ai(prompt):
    """Call the OpenAI API and return the response content string."""
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
    """Strips version numbers and junk, but preserves hyphens and dots (e.g. GPT-4o)."""
    if not name or not isinstance(name, str):
        return "Unknown AI"
    name = re.sub(r'v\d+(\.\d+)*', '', name)
    name = re.sub(r'[^a-zA-Z0-9\s\.\-]', '', name)
    return name.strip()


def is_real_url(url):
    """Checks if the site is reachable. Accepts any non-error HTTP response (status < 400)."""
    u = str(url or "").strip()
    if not u or u.lower() == "n/a" or "." not in u:
        return False
    if not u.startswith("http"):
        u = "https://" + u
    try:
        response = requests.get(u, timeout=5, allow_redirects=True,
                                headers={"User-Agent": "Mozilla/5.0"})
        return response.status_code < 400
    except Exception as e:
        print(f"⚠️ URL check failed for {u}: {e}")
        return False


def format_results(results):
    """Format Tavily results into a readable text block for AI prompts."""
    if not results:
        return "No search results found."
    lines = []
    for r in results:
        title = r.get("title", "")
        url = r.get("url", "")
        content = r.get("content", "")[:200]
        lines.append(f"- {title}: {url} — {content}")
    return "\n".join(lines)


def merge_deal(existing, new_data):
    """
    Merge new deal fields into an existing tool entry.
    Only updates code, discount_amount, and pricing_info — never overwrites
    description, url, category, or features with AI-generated data.
    """
    for field in ("code", "discount_amount", "pricing_info"):
        val = str(new_data.get(field, "") or "").strip()
        if val and val.upper() != "N/A":
            existing[field] = val
    return existing


def main():
    print("🚀 Starting Monday Narnia Harvest...")

    # 1. LOAD DATABASE
    database = {}
    if os.path.exists("ai_deals.json"):
        try:
            with open("ai_deals.json", "r") as f:
                for item in json.load(f):
                    name = clean_name(item.get("tool_name"))
                    database[name] = item
        except Exception as e:
            print(f"⚠️ Could not load ai_deals.json: {e}")

    # 2. HEALTH CHECK (VOTES)
    # If a tool accumulates 5+ broken votes:
    #   - Search Tavily for an updated deal
    #   - If the AI finds a valid replacement, merge it in
    #   - If nothing is found, remove the tool from the database entirely
    votes = supabase_get("deal_votes")
    broken_tools = {}
    for v in votes:
        if v.get("vote_type") == "broken":
            name = clean_name(v.get("tool_name"))
            broken_tools[name] = broken_tools.get(name, 0) + 1

    for name, count in broken_tools.items():
        if count >= 5:
            print(f"⚠️ {name} has {count} broken votes. Searching for replacement deal...")
            results = search_tavily(f"active discount promo code for {name} 2026")

            if results:
                prompt = "\n".join([
                    f"The AI tool '{name}' has been reported as having a broken deal.",
                    "The search results below may contain an updated promo code or pricing.",
                    "",
                    "Search Results:",
                    format_results(results),
                    "",
                    "If you can find a valid active deal, return JSON:",
                    '{"found": true, "code": "...", "discount_amount": "...", "pricing_info": "...", "tool_url": "..."}',
                    "If no valid deal is found, return:",
                    '{"found": false}',
                    "Only return found=true if you are confident the deal is currently active.",
                ])

                raw = call_ai(prompt)
                replaced = False

                if raw:
                    try:
                        result = json.loads(raw)
                        if result.get("found") and name in database:
                            # Validate the new URL before accepting it
                            new_url = result.get("tool_url", "")
                            if new_url and not is_real_url(new_url):
                                print(f"⚠️ {name} — replacement URL not reachable, ignoring url field.")
                                result.pop("tool_url", None)
                            elif new_url and is_real_url(new_url):
                                database[name]["tool_url"] = new_url

                            database[name] = merge_deal(database[name], result)
                            print(f"🔄 {name} — replacement deal found and updated.")
                            replaced = True
                    except Exception as e:
                        print(f"⚠️ Failed to parse replacement result for {name}: {e}")

                if not replaced:
                    print(f"❌ {name} — no valid replacement found. Removing from database.")
                    database.pop(name, None)
            else:
                print(f"❌ {name} — no search results found. Removing from database.")
                database.pop(name, None)

    # 3. PROACTIVE SCOUTING (NARNIA MODE)
    priority_categories = [
        "Music AI", "Legal AI", "Medical AI", "Industrial AI", "Video AI",
        "Writing AI", "Marketing AI", "SEO AI", "Image AI", "Coding AI",
        "Search AI", "Voice AI", "No-Code AI"
    ]
    existing_categories = list(set([
        item.get("category") for item in database.values() if item.get("category")
    ]))
    all_targets_cats = list(set(priority_categories + existing_categories))
    print("Proactively scouting high-value niches...")

    # 4. HUNT & UPDATE
    priority_tools = ["Claude", "ChatGPT", "Midjourney", "ElevenLabs", "HeyGen", "Perplexity"]
    targets = list(set(priority_tools + all_targets_cats))

    for target in targets:
        print(f"🔍 Searching: {target}")
        results = search_tavily(
            f"best {target} AI tools deals and active promo codes 2026 including simplycodes links"
        )

        prompt = "\n".join([
            f"You are given real search results about '{target}'. Extract deal information from them.",
            "",
            "Search Results:",
            format_results(results),
            "",
            "Return a JSON object with a 'tools' array. Each item must have these fields:",
            '{"tools": [',
            '  {"tool_name": "...", "tool_url": "...", "code": "...", "discount_amount": "...",',
            '   "pricing_info": "...", "key_features": "...", "description": "...", "category": "..."}',
            "]}",
            "",
            "Rules:",
            "1. Tool name must be a simple string (e.g. \"Midjourney\", \"ElevenLabs\").",
            "2. Description must be informative (Wikipedia style, 1-2 sentences).",
            f"3. Category must be one of: {all_targets_cats}.",
            "4. Only include tools you can identify from the search results above.",
            "5. If no promo code is found, set \"code\" to \"N/A\".",
        ])

        raw = call_ai(prompt)
        if raw:
            try:
                found = json.loads(raw).get("tools", [])
                for t in found:
                    name = clean_name(t.get("tool_name"))
                    if not name or name == "Unknown AI":
                        continue
                    if not is_real_url(t.get("tool_url")):
                        print(f"🛡️ Skipping {name} — URL not reachable.")
                        continue
                    if name in database:
                        # Merge: only update deal fields, preserve everything else
                        database[name] = merge_deal(database[name], t)
                        print(f"🔄 Updated deal data for existing tool: {name}")
                    else:
                        # New tool — add fresh
                        database[name] = t
                        print(f"✨ New tool added: {name}")
            except Exception as e:
                print(f"⚠️ Failed to parse AI response for '{target}': {e}")
                continue

    # 5. SAVE
    with open("ai_deals.json", "w") as f:
        json.dump(list(database.values()), f, indent=4)
    print(f"✅ Harvest finished. {len(database)} deals saved.")


if __name__ == "__main__":
    main()
