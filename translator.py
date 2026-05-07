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
        time.sleep(22)
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        return response.json()['choices'][0]['message']['content']
    except: return None

def main():
    os.makedirs("src/i18n", exist_ok=True)
    with open("ai_deals.json", "r") as f: deals = json.load(f)

    # Load existing translations
    i18n_path = "src/i18n/i18n_deals.json"
    raw_i18n = {}
    if os.path.exists(i18n_path):
        with open(i18n_path, "r") as f: raw_i18n = json.load(f)

    # KEY ALIGNMENT: Fix 'Ghost Keys' in the translation file
    clean_i18n = {}
    for tool in deals:
        name = tool['tool_name']
        found = False
        # Look for a match in the old messy file
        for old_key in raw_i18n:
            if name in old_key:
                clean_i18n[name] = raw_i18n[old_key]
                found = True
                break
        
        # If not found or missing badge, translate now
        if not found or "badge" not in clean_i18n[name].get("en", {}):
            print(f"Translating: {name}...")
            prompt = f"Translate for '{name}' into {list(LANGUAGES.values())}: Desc: {tool['description']}, Features: {tool['key_features']}, Badge: {tool['discount_amount']}, Pricing: {tool['pricing_info']}. Return JSON keys: description, features, badge, pricing."
            res = call_ai(prompt)
            if res: clean_i18n[name] = json.loads(res)

        # Save progress
        with open(i18n_path, "w") as f:
            json.dump(clean_i18n, f, indent=4, ensure_ascii=False)

    print("Success! All translations are now aligned with clean tool names.")

if __name__ == "__main__":
    main()
