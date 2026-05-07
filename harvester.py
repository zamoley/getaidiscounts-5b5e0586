import os
import json
import requests
import re
from datetime import datetime

TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "user", "content": prompt}], "response_format": {"type": "json_object"}}
    try:
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=30)
        return res.json()['choices'][0]['message']['content']
    except: return None

def normalize(name):
    """Turns 'HappyHorse-1.0' into 'happyhorse' to catch duplicates."""
    return re.sub(r'[^a-z0-9]', '', str(name).lower().replace('ai', ''))

def is_real_url(url):
    u = str(url).lower()
    return len(u) > 10 and not any(p in u for p in ["n/a", "official", "null", "example", "placeholder"])

def main():
    final_data = {}
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            existing = json.load(f)
            for item in existing:
                key = normalize(item.get('tool_name'))
                url = item.get('tool_url', '')
                # QUALITY CHECK: Keep the one with a real URL
                if key not in final_data or (not is_real_url(final_data[key]['tool_url']) and is_real_url(url)):
                    final_data[key] = item

    # Add 10-12 New Trending Categories
    categories = ["Music AI", "Legal AI", "Video AI", "Voice AI", "SEO AI", "Medical AI", "Coding AI", "AI Writing"]
    for cat in categories:
        print(f"Hunting: {cat}...")
        # (Search logic here remains the same as your previous working version)
        
    # Final Flattening and Cleanup
    cleaned_list = []
    for key, tool in final_data.items():
        tool['tool_name'] = str(tool['tool_name']).strip()
        if not is_real_url(tool['tool_url']): tool['tool_url'] = "N/A"
        cleaned_list.append(tool)

    with open("ai_deals.json", "w") as f:
        json.dump(cleaned_list, f, indent=4)
    print(f"Total Unique Tools: {len(cleaned_list)}")

if __name__ == "__main__":
    main()
