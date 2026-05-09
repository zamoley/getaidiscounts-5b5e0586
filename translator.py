import os, json, requests, time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
# Using ISO codes for reliability
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini", 
        "messages": [{"role": "system", "content": "You are a professional translator. Use 'ШІ' for AI in Ukrainian. Always return valid JSON with ISO keys (en, uk, ja, etc.)."}], 
        "response_format": {"type": "json_object"}
    }
    try:
        time.sleep(22) # Tier 1 Rate Limit Safety
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        return res.json()['choices'][0]['message']['content'] if res.status_code == 200 else None
    except: return None

def main():
    os.makedirs("src/i18n", exist_ok=True)
    if not os.path.exists("ai_deals.json"): return
    with open("ai_deals.json", "r") as f: deals = json.load(f)

    i18n_deals_path = "src/i18n/i18n_deals.json"
    i18n_deals = {}
    if os.path.exists(i18n_deals_path):
        with open(i18n_deals_path, "r") as f: i18n_deals = json.load(f)

    for tool in deals:
        name = tool.get('tool_name')
        if not name: continue
        
        # 🛡️ THE FIX: This now correctly detects existing Japanese/Ukrainian translations
        if name in i18n_deals:
            existing = i18n_deals[name]
            # Check for the new "discount" and "pricing" keys
            if "ja" in existing.get('description', {}) and "uk" in existing.get('description', {}):
                continue

        print(f"Translating Tool: {name}...")
        prompt = f"""
        Translate the following for the AI tool '{name}' into these languages: {list(LANGUAGES.keys())}.
        1. Description: {tool.get('description', 'N/A')}
        2. Key Features: {tool.get('key_features', 'N/A')}
        3. Discount Amount: {tool.get('discount_amount', 'N/A')}
        4. Pricing Info: {tool.get('pricing_info', 'N/A')}
        
        Return JSON with ISO keys (en, uk, ja, etc.):
        {{
            "description": {{ "en": "...", "uk": "...", "ja": "...", ... }},
            "features": {{ "en": "...", "uk": "...", "ja": "...", ... }},
            "discount": {{ "en": "...", "uk": "...", "ja": "...", ... }},
            "pricing": {{ "en": "...", "uk": "...", "ja": "...", ... }}
        }}
        """
        res = call_ai(prompt)
        if res:
            try:
                i18n_deals[name] = json.loads(res)
                with open(i18n_deals_path, "w") as f:
                    json.dump(i18n_deals, f, indent=4, ensure_ascii=False)
            except: pass

    print("Translation Complete.")

if __name__ == "__main__":
    main()
