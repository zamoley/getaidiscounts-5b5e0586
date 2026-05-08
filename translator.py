import os, json, requests, time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "system", "content": "Translate EVERY field. Use 'ШІ' for AI in Ukrainian (NEVER 'ІШ'). Translate 'OFF', 'Free', and 'Starts at'."}], "response_format": {"type": "json_object"}}
    try:
        time.sleep(22)
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        return res.json()['choices'][0]['message']['content'] if res.status_code == 200 else None
    except: return None

def main():
    os.makedirs("src/i18n", exist_ok=True)
    with open("ai_deals.json", "r") as f: deals = json.load(f)

    # 1. TRANSLATE CATEGORIES (Force 'ШІ')
    all_cats = list(set([d.get('category', 'General AI') for d in deals]))
    cat_prompt = f"Translate these AI categories into {list(LANGUAGES.values())}: {all_cats}. Format: {{'CatName': {{'en': '...', 'uk': '...', ...}}}}"
    res_cat = call_ai(cat_prompt)
    if res_cat:
        cat_data = json.loads(res_cat)
        for c in cat_data:
            if 'uk' in cat_data[c]: cat_data[c]['uk'] = cat_data[c]['uk'].replace('ІШ', 'ШІ')
        with open("src/i18n/i18n_categories.json", "w") as f:
            json.dump(cat_data, f, indent=4, ensure_ascii=False)

    # 2. TRANSLATE TOOLS
    i18n_path = "src/i18n/i18n_deals.json"
    i18n_deals = {}
    if os.path.exists(i18n_path):
        with open(i18n_path, "r") as f: i18n_deals = json.load(f)

    for tool in deals:
        name = str(tool.get('tool_name', 'N/A'))
        if name == "N/A" or len(name) < 2: continue
        
        if name in i18n_deals and "badge" in i18n_deals[name].get("en", {}): continue

        print(f"Translating: {name}...")
        prompt = f"Translate fields for '{name}' into {list(LANGUAGES.values())}: desc: {tool['description']}, badge: {tool['discount_amount']}, price: {tool['pricing_info']}."
        res = call_ai(prompt)
        if res:
            i18n_deals[name] = json.loads(res)
            with open(i18n_path, "w") as f:
                json.dump(i18n_deals, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    main()
