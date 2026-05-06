import os
import json
import requests
import time
from datetime import datetime

# API Keys (Set in GitHub Secrets)
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

def search_tavily(query):
    url = "https://api.tavily.com/search"
    payload = {"api_key": TAVILY_API_KEY, "query": query, "search_depth": "advanced", "max_results": 10}
    try:
        response = requests.post(url, json=payload, timeout=15)
        return response.json().get("results", [])
    except:
        return []

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "You are a data extractor that outputs ONLY valid JSON. All field values must be simple strings, never objects."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"}
    }
    try:
        # ⏳ Rate Limit Protection (Tier 0: 3 RPM)
        print("Waiting 22s for rate limits...")
        time.sleep(22)
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=30)
        res_data = response.json()
        if "error" in res_data:
            print(f"❌ OpenAI Error: {res_data['error']['message']}")
            return None
        return res_data['choices'][0]['message']['content']
    except Exception as e:
        print(f"System Error: {e}")
        return None

def main():
    print(f"--- Starting Harvest at {datetime.now()} ---")
    database = []
    
    # Discovery categories
    categories = ["Video AI", "Writing AI", "Coding AI", "Voice AI", "Image AI", "SEO AI", "Marketing AI"]
    
    for cat in categories:
        print(f"\n--- Scouting Category: {cat} ---")
        tool_results = search_tavily(f"top new {cat} tools with discounts 2026")
        tool_context = "\n".join([f"{r['title']}: {r['content']}" for r in tool_results])
        
        tool_prompt = f"List 3 specific AI tools for {cat} from: {tool_context}. Return JSON: {{'tools': []}}"
        tool_res = call_ai(tool_prompt)
        if not tool_res: continue
        
        target_tools = json.loads(tool_res).get('tools', [])
        
        for tool in target_tools:
            print(f"Hunting deal for: {tool}")
            deal_results = search_tavily(f"{tool} AI tool discount promo code 2026")
            deal_context = "\n".join([f"{r['title']}: {r['content']}" for r in deal_results])
            
            # THE STRICTOR PROMPT
            prompt = f"""
            Extract deal for '{tool}' from: {deal_context}
            Return JSON with these fields. 
            CRITICAL: All values MUST be simple strings. DO NOT use nested objects or key-value pairs inside fields.
            {{
                "tool_name": "{tool}",
                "tool_url": "OFFICIAL_URL",
                "code": "CODE_OR_NULL",
                "discount_amount": "e.g. 20% OFF",
                "pricing_info": "ONE STRING, e.g. '$15/mo'",
                "key_features": ["Feature 1", "Feature 2"],
                "description": "One sentence summary.",
                "category": "{cat}"
            }}
            """
            raw_data = call_ai(prompt)
            
            if raw_data:
                try:
                    data = json.loads(raw_data)
                    data["last_verified"] = datetime.now().strftime('%Y-%m-%d')
                    data["category"] = cat
                    database.append(data)
                    print(f"✅ Successfully added {tool}")
                except:
                    continue

    # Final Merge & Save to ROOT (where the website looks)
    file_path = "ai_deals.json"
    
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            try:
                existing = json.load(f)
            except:
                existing = []
            names = {d['tool_name'].lower() for d in existing}
            for d in database:
                if d['tool_name'].lower() not in names:
                    existing.append(d)
            database = existing

    with open(file_path, "w") as f:
        json.dump(database, f, indent=4)
    
    print(f"\n--- Harvest Complete! Total Tools: {len(database)} ---")

if __name__ == "__main__":
    main()
