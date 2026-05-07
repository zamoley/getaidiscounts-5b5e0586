import os
import json
import requests
import time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "system", "content": "Always use 'ШІ' for AI in Ukrainian. Translate EVERYTHING."}, {"role": "user", "content": prompt}], "response_format": {"type": "json_object"}}
    try:
        time.sleep(22)
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        return res.json()['choices'][0]['message']['content']
    except: return None

def main():
    os.makedirs("src/i18n", exist_ok=True)
    with open("ai_deals.json", "r") as f: deals = json.load(f)
    
    i18n_path = "src/i18n/i18n_deals.json"
    i18n_deals = {}
    if os.path.exists(i18n_path):
        with open(i18n_path, "r") as f: i18n_deals = json.load(f)

    for tool in deals:
        name = str(tool['tool_name'])
        # AGGRESSIVE CHECK: Re-translate if badge or pricing is missing
        if name in i18n_deals and "badge" in i18n_deals[name].get("en", {}):
            continue

        print(f"Full Localization: {name}...")
        prompt = f"Translate '{name}' into {list(LANGUAGES.values())}: Desc: {tool['description']}, Features: {tool['key_features']}, Badge: {tool['discount_amount']}, Pricing: {tool['pricing_info']}. Return JSON keys: description, features, badge, pricing."
        res = call_ai(prompt)
        if res:
            i18n_deals[name] = json.loads(res)
            with open(i18n_path, "w") as f:
                json.dump(i18n_deals, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    main()
