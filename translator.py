import os
import json
import requests
import time
from datetime import datetime

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

LANGUAGES = {
    "en": "English", "uk": "Ukrainian", "ja": "Japanese", 
    "es": "Spanish", "pt": "Portuguese", "fr": "French", 
    "de": "German", "zh": "Chinese", "it": "Italian"
}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "system", "content": "You are a translation expert that outputs ONLY valid JSON."}, 
                     {"role": "user", "content": prompt}],
        "response_format": {"type": "json_object"}
    }
    try:
        print("Waiting 22s for rate limits...")
        time.sleep(22)
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=30)
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"Translation Error: {e}")
        return None

def main():
    os.makedirs("src/i18n", exist_ok=True)
    deals_path = "ai_deals.json"
    i18n_deals_path = "src/i18n/i18n_deals.json"

    if not os.path.exists(deals_path):
        print(f"ERROR: {deals_path} not found!")
        return

    with open(deals_path, "r") as f:
        deals = json.load(f)

    i18n_deals = {}
    # We clear the old file to force it to re-generate with the NEW fields
    # If you have 35+ tools, this will take about 20-30 minutes to finish.

    for tool in deals:
        name = tool['tool_name']
        print(f"Translating Tool: {name}...")
        
        prompt = f"""
        Translate the following for '{name}' into these languages: {', '.join(LANGUAGES.values())}:
        - Description: {tool['description']}
        - Features: {tool['key_features']}
        - Badge (Discount text): {tool['discount_amount']}
        - Pricing: {tool['pricing_info']}
        
        Return JSON where each language key (en, uk, ja, etc.) has: 'description', 'features', 'badge', 'pricing'.
        """
        
        res = call_ai(prompt)
        if res:
            try:
                i18n_deals[name] = json.loads(res)
                # Save progress after each tool
                with open(i18n_deals_path, "w") as f:
                    json.dump(i18n_deals, f, indent=4, ensure_ascii=False)
            except: continue

    print("Localization complete.")

if __name__ == "__main__":
    main()
