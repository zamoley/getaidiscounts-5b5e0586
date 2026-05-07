import os
import json
import requests
import time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

# 🎯 BATCH SETTING: Do 10 tools per run to stay safe
MAX_TOOLS_PER_RUN = 10 

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "system", "content": "Translate to 9 languages. Return JSON."}, {"role": "user", "content": prompt}], "response_format": {"type": "json_object"}}
    try:
        time.sleep(22)
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        return res.json()['choices'][0]['message']['content'] if res.status_code == 200 else None
    except: return None

def main():
    os.makedirs("src/i18n", exist_ok=True)
    with open("ai_deals.json", "r") as f: deals = json.load(f)
    
    i18n_path = "src/i18n/i18n_deals.json"
    i18n_deals = {}
    if os.path.exists(i18n_path):
        with open(i18n_path, "r") as f:
            try: i18n_deals = json.load(f)
            except: i18n_deals = {}

    tools_processed = 0
    for tool in deals:
        name = str(tool.get('tool_name', 'Unknown'))
        
        # SMART SKIP: If already done, skip it
        if name in i18n_deals:
            continue

        if tools_processed >= MAX_TOOLS_PER_RUN:
            print(f"Batch of {MAX_TOOLS_PER_RUN} reached. Saving and stopping.")
            break

        print(f"Processing: {name}...")
        prompt = f"Translate fields for '{name}' into {list(LANGUAGES.values())}: desc: {tool['description']}, features: {tool['key_features']}, badge: {tool['discount_amount']}, price: {tool['pricing_info']}. Format: {{'en': {{'description': '...', 'badge': '...'}}, 'uk': {{...}}, ...}}"
        
        res = call_ai(prompt)
        if res:
            try:
                i18n_deals[name] = json.loads(res)
                tools_processed += 1
                with open(i18n_path, "w") as f:
                    json.dump(i18n_deals, f, indent=4, ensure_ascii=False)
            except: pass

    print(f"Success! {tools_processed} tools added to the library.")

if __name__ == "__main__":
    main()
