import os, json, requests, time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "system", "content": "You are a translation expert. CRITICAL: In Ukrainian, 'AI' must ALWAYS be 'ШІ'. Never return 'N/A' - if data is missing, describe the tool creatively based on its name."}, 
                     {"role": "user", "content": prompt}],
        "response_format": {"type": "json_object"}
    }
    try:
        time.sleep(22)
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        return res.json()['choices'][0]['message']['content'] if res.status_code == 200 else None
    except: return None

def main():
    os.makedirs("src/i18n", exist_ok=True)
    with open("ai_deals.json", "r") as f: deals = json.load(f)

    # 1. CATEGORIES (Wikipedia Grade)
    i18n_cats_path = "src/i18n/i18n_categories.json"
    i18n_cats = {}
    if os.path.exists(i18n_cats_path):
        with open(i18n_cats_path, "r") as f: i18n_cats = json.load(f)

    all_cats = list(set([d.get('category', 'General AI') for d in deals]))
    for cat in all_cats:
        if cat in i18n_cats:
            # Force fix for Ukrainian typo even in old data
            if 'uk' in i18n_cats[cat]: i18n_cats[cat]['uk'] = i18n_cats[cat]['uk'].replace('ІШ', 'ШІ')
            continue
            
        print(f"Translating Category: {cat}...")
        prompt = f"Translate the AI category '{cat}' into {list(LANGUAGES.values())}. JSON: {{'en': '...', 'uk': '...', ...}}"
        res = call_ai(prompt)
        if res:
            try:
                data = json.loads(res)
                if 'uk' in data: data['uk'] = data['uk'].replace('ІШ', 'ШІ')
                i18n_cats[cat] = data
                with open(i18n_cats_path, "w") as f: json.dump(i18n_cats, f, indent=4, ensure_ascii=False)
            except: pass

    # 2. TOOLS (No-N/A Policy)
    i18n_deals_path = "src/i18n/i18n_deals.json"
    i18n_deals = {}
    if os.path.exists(i18n_deals_path):
        with open(i18n_deals_path, "r") as f: i18n_deals = json.load(f)

    for tool in deals:
        name = tool['tool_name']
        if name in i18n_deals: continue
        
        print(f"Wikipedia Translation: {name}...")
        prompt = f"Translate for '{name}' into {list(LANGUAGES.values())}: Desc: {tool['description']}, Badge: {tool['discount_amount']}, Price: {tool['pricing_info']}. NO 'N/A' allowed."
        res = call_ai(prompt)
        if res:
            try:
                i18n_deals[name] = json.loads(res)
                with open(i18n_deals_path, "w") as f: json.dump(i18n_deals, f, indent=4, ensure_ascii=False)
            except: pass

if __name__ == "__main__":
    main()
