import os
import json
import requests
import time
from datetime import datetime

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
        "messages": [{"role": "user", "content": prompt}],
        "response_format": {"type": "json_object"}
    }
    try:
        # ⏳ Rate Limit Protection: Wait to stay under 3 RPM limit
        print("Waiting 22s to respect API rate limits...")
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
    print(f"--- Starting Slow-and-Steady Harvest at {datetime.now()} ---")
    database = []
    
    # Discovery categories
    categories = ["Video AI", "Writing AI", "Coding AI", "Voice AI", "Image AI", "SEO AI"]
    
    for cat in categories:
        print(f"\n--- Scouting Category: {cat} ---")
        tool_results = search_tavily(f"top new {cat} tools with discounts 2026")
        tool_context = "\n".join([f"{r['title']}: {r['content']}" for r in tool_results])
        
        # Get tool names
        tool_prompt = f"List 3 specific AI tools for {cat} from: {tool_context}. Return JSON: {{'tools': []}}"
        tool_res = call_ai(tool_prompt)
        if not tool_res: continue
        
        target_tools = json.loads(tool_res).get('tools', [])
        
        for tool in target_tools:
            print(f"Hunting deal for: {tool}")
            deal_results = search_tavily(f"{tool} AI tool discount promo code 2026")
            deal_context = "\n".join([f"{r['title']}: {r['content']}" for r in deal_results])
            
            prompt = f"Extract deal for '{tool}' from: {deal_context}. Return JSON with: tool_name, tool_url, code, discount_amount, pricing_info, key_features, description, category."
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

    # Final Merge
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            try:
                existing = json.load(f)
            except:
                existing = []
            names = {d['tool_name'].lower() for d in existing}
            for d in database:
                if d['tool_name'].lower() not in names:
                    existing.append(d)
            database = existing

    with open("ai_deals.json", "w") as f:
        json.dump(database, f, indent=4)
    
    print(f"\n--- Harvest Complete! Total Tools: {len(database)} ---")

if __name__ == "__main__":
    main()
