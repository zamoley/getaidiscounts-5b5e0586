import os
import json
import requests
import time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

# 🎯 BATCH SETTING: Change this to do more or fewer tools per run
MAX_TOOLS_PER_RUN = 10 

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "system", "content": "Always use 'ШІ' for AI in Ukrainian. Translate EVERYTHING."}, {"role": "user", "content": prompt}], "response_format": {"type": "json_object"}}
    try:
        time.sleep(22)
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        return res.json()['choices'][0]['message']['content'] if res.status_code == 200 else None
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

    tools_processed = 0
    for tool in deals:
        name = str(tool.get('tool_name', 'Unknown'))
        
        # SMART SKIP: If already translated with badge, skip
        if name in i18n_deals and "badge" in i18n_deals[name].get("en", {}):
            continue

        if tools_processed >= MAX_TOOLS_PER_RUN:
            print(f"Batch limit of {MAX_TOOLS_PER_RUN} reached. Saving and stopping.")
            break

        print(f"Batch Processing: {name}...")
        prompt = f"Translate '{name}' into {list(LANGUAGES.values())}: Desc: {tool['description']}, Features: {tool['key_features']}, Badge: {tool['discount_amount']}, Pricing: {tool['pricing_info']}. Return JSON keys: description, features, badge, pricing."
        res = call_ai(prompt)
        if res:
            try:
                i18n_deals[name] = json.loads(res)
                tools_processed += 1
                # Save progress locally
                with open(i18n_path, "w") as f:
                    json.dump(i18n_deals, f, indent=4, ensure_ascii=False)
            except: pass

    # Also translate categories once if they are missing
    cat_path = "src/i18n/i18n_categories.json"
    if not os.path.exists(cat_path):
        all_cats = list(set([d.get('category', 'General AI') for d in deals]))
        cat_prompt = f"Translate categories into {list(LANGUAGES.values())}: {all_cats}. Format: {{'CatName': {{'en': '...', 'uk': '...', ...}}}}"
        cat_res = call_ai(cat_prompt)
        if cat_res:
            with open(cat_path, "w") as f:
                json.dump(json.loads(cat_res), f, indent=4, ensure_ascii=False)

    print(f"Success! Processed {tools_processed} tools. Run again to do the next batch.")

if __name__ == "__main__":
    main()
