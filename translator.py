import os
import json
import requests
import time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini", 
        "messages": [
            {"role": "system", "content": "Translation Expert. For Ukrainian, ALWAYS use 'ШІ' for AI. Translate EVERYTHING (OFF, Credits, Starts at, etc.). Use strict JSON Format A."}, 
            {"role": "user", "content": prompt}
        ], 
        "response_format": {"type": "json_object"}
    }
    try:
        time.sleep(22) # Rate limit safety
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        return res.json()['choices'][0]['message']['content'] if res.status_code == 200 else None
    except: return None

def main():
    os.makedirs("src/i18n", exist_ok=True)
    with open("ai_deals.json", "r") as f: deals = json.load(f)

    # 1. TRANSLATE CATEGORIES (Ensures uniform buttons)
    all_cats = list(set([d.get('category', 'General AI') for d in deals]))
    prompt_cat = f"Translate these categories into {list(LANGUAGES.values())}: {all_cats}. Format: {{'CategoryName': {{'en': '...', 'uk': '...', ...}}}}"
    res_cat = call_ai(prompt_cat)
    if res_cat:
        with open("src/i18n/i18n_categories.json", "w") as f:
            json.dump(json.loads(res_cat), f, indent=4, ensure_ascii=False)

    # 2. TRANSLATE TOOLS (Format A for Cards and Comparison)
    i18n_path = "src/i18n/i18n_deals.json"
    i18n_deals = {}
    if os.path.exists(i18n_path):
        with open(i18n_path, "r") as f: i18n_deals = json.load(f)

    for tool in deals:
        name = str(tool['tool_name'])
        # Only translate if badge/pricing is missing or old format
        if name in i18n_deals and isinstance(i18n_deals[name].get("en"), dict) and "badge" in i18n_deals[name]["en"]:
            continue

        print(f"Translating: {name}...")
        prompt = f"Translate fields for '{name}' into {list(LANGUAGES.values())}: desc: {tool['description']}, feats: {tool['key_features']}, badge: {tool['discount_amount']}, price: {tool['pricing_info']}. Format: {{'en': {{'description': '...', 'features': '...', 'badge': '...', 'pricing': '...'}}, 'uk': {{...}}, ...}}"
        res = call_ai(prompt)
        if res:
            try:
                i18n_deals[name] = json.loads(res)
                with open(i18n_path, "w") as f:
                    json.dump(i18n_deals, f, indent=4, ensure_ascii=False)
            except: pass

    print("Empire fully localized.")

if __name__ == "__main__":
    main()
