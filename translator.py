import os
import json
import requests
import time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "system", "content": "Return valid JSON."}, {"role": "user", "content": prompt}], "response_format": {"type": "json_object"}}
    try:
        time.sleep(22)
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        return response.json()['choices'][0]['message']['content'] if response.status_code == 200 else None
    except: return None

def main():
    os.makedirs("src/i18n", exist_ok=True)
    if not os.path.exists("ai_deals.json"): return
    with open("ai_deals.json", "r") as f: deals = json.load(f)

    i18n_path = "src/i18n/i18n_deals.json"
    i18n_deals = {}
    if os.path.exists(i18n_path):
        with open(i18n_path, "r") as f:
            try: i18n_deals = json.load(f)
            except: i18n_deals = {}

    for tool in deals:
        name = str(tool.get('tool_name', 'Unknown'))
        
        # SUPER SAFE SKIP: Only skip if 'badge' is a clean string in the English translation
        is_complete = False
        if name in i18n_deals:
            en_data = i18n_deals[name].get("en", {})
            if isinstance(en_data, dict) and isinstance(en_data.get("badge"), str):
                is_complete = True
        
        if is_complete:
            continue

        print(f"Translating: {name}...")
        prompt = f"Translate for '{name}' into {list(LANGUAGES.values())}: Desc: {tool.get('description')}, Features: {tool.get('key_features')}, Badge: {tool.get('discount_amount')}, Pricing: {tool.get('pricing_info')}. Return JSON keys: description, features, badge, pricing."
        
        res = call_ai(prompt)
        if res:
            try:
                i18n_deals[name] = json.loads(res)
                with open(i18n_path, "w") as f:
                    json.dump(i18n_deals, f, indent=4, ensure_ascii=False)
            except: print(f"Skipping {name} due to AI formatting error.")

if __name__ == "__main__":
    main()
