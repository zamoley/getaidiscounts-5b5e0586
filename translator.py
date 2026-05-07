import os
import json
import requests
import time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "system", "content": "Return ONLY valid JSON."}, {"role": "user", "content": prompt}], "response_format": {"type": "json_object"}}
    try:
        print("Waiting 22s for rate limit...")
        time.sleep(22)
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        # SAFETY: Check if we got a successful response
        if response.status_code != 200:
            print(f"API Error {response.status_code}: {response.text}")
            return None
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"Connection Error: {e}")
        return None

def main():
    os.makedirs("src/i18n", exist_ok=True)
    if not os.path.exists("ai_deals.json"): return
    
    with open("ai_deals.json", "r") as f:
        deals = json.load(f)

    i18n_deals = {}
    # Load existing if available to resume progress
    if os.path.exists("src/i18n/i18n_deals.json"):
        with open("src/i18n/i18n_deals.json", "r") as f:
            i18n_deals = json.load(f)

    for tool in deals:
        name = str(tool.get('tool_name', 'Unknown'))
        
        # If already has badge, skip to save time/cost
        if name in i18n_deals and "badge" in i18n_deals[name].get("en", {}):
            continue

        print(f"Processing: {name}...")
        prompt = f"Translate for '{name}' into {list(LANGUAGES.values())}: Desc: {tool['description']}, Features: {tool['key_features']}, Badge: {tool['discount_amount']}, Pricing: {tool['pricing_info']}. Return JSON keys: description, features, badge, pricing."
        
        res = call_ai(prompt)
        if res:
            try:
                i18n_deals[name] = json.loads(res)
                # Save progress after each tool so we don't lose work
                with open("src/i18n/i18n_deals.json", "w") as f:
                    json.dump(i18n_deals, f, indent=4, ensure_ascii=False)
            except:
                print(f"Failed to parse JSON for {name}")

if __name__ == "__main__":
    main()
