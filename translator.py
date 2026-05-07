import os
import json
import requests
import time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "system", "content": "Return valid JSON. Use 'ШІ' for Ukrainian."}, {"role": "user", "content": prompt}], "response_format": {"type": "json_object"}}
    time.sleep(22)
    try:
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
        # RE-TRANSLATE EVERYTHING TO ENSURE UNIFORMITY
        print(f"Updating Translation: {name}...")
        prompt = f"Translate fields for '{name}' into {list(LANGUAGES.values())}: desc: {tool['description']}, feats: {tool['key_features']}, badge: {tool['discount_amount']}, price: {tool['pricing_info']}. Format: {{'en': {{'description': '...', 'badge': '...'}}, 'uk': {{...}}, ...}}"
        res = call_ai(prompt)
        if res:
            i18n_deals[name] = json.loads(res)
            with open(i18n_path, "w") as f:
                json.dump(i18n_deals, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    main()
