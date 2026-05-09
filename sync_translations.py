import json
import os

LANG_MAP = {
    "English": "en", "Japanese": "ja", "Ukrainian": "uk", "Spanish": "es",
    "Portuguese": "pt", "French": "fr", "German": "de", "Chinese": "zh", "Italian": "it"
}

def sync():
    with open('ai_deals.json', 'r', encoding='utf-8') as f:
        ai_deals = json.load(f)
    
    try:
        with open('src/i18n/i18n_deals.json', 'r', encoding='utf-8') as f:
            translations = json.load(f)
    except:
        translations = {}

    live_file = {}

    # 1. SMART DICTIONARY: Grab EVERY price/badge string currently in use
    for tool in ai_deals:
        p = tool.get('pricing_info', 'N/A')
        b = tool.get('discount_amount', 'N/A')
        
        # If we have a translation for this specific tool, use its values
        if tool['tool_name'] in translations:
            t_data = translations[tool['tool_name']]
            live_file[p] = {LANG_MAP[k]: v for k, v in t_data.get('pricing', {}).items() if k in LANG_MAP}
            live_file[b] = {LANG_MAP[k]: v for k, v in t_data.get('badge', {}).items() if k in LANG_MAP}

    # 2. TOOL DESCRIPTIONS
    for name, data in translations.items():
        entry = {}
        for lang_name, lang_code in LANG_MAP.items():
            entry[lang_code] = {
                "description": data.get("description", {}).get(lang_name, ""),
                "key_features": data.get("features", {}).get(lang_name, ""),
                "badge": data.get("badge", {}).get(lang_name, ""),
                "pricing": data.get("pricing", {}).get(lang_name, "")
            }
        live_file[name] = entry

    output_path = 'src/i18n/tool-translations.json'
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(live_file, f, indent=2, ensure_ascii=False)
    
    print(f"Synced {len(live_file)} tools and strings.")

if __name__ == "__main__":
    sync()
