import json
import os
import requests

# API Configuration (Uses your existing GitHub Secret)
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

LANG_MAP = {
    "English": "en", "Japanese": "ja", "Ukrainian": "uk", "Spanish": "es",
    "Portuguese": "pt", "French": "fr", "German": "de", "Chinese": "zh", "Italian": "it"
}

def translate_badge(text):
    """Uses AI to translate new/unique badges into all 9 languages."""
    if not OPENAI_API_KEY:
        return None
    
    prompt = f"Translate the following short UI badge string into: {', '.join(LANG_MAP.keys())}. Return only a JSON object where keys are the language names. String: '{text}'"
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json={
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"}
            }
        )
        return response.json()['choices'][0]['message']['content']
    except:
        return None

def sync():
    # Load Master Files
    with open('ai_deals.json', 'r', encoding='utf-8') as f:
        ai_deals = json.load(f)
    
    try:
        with open('src/i18n/i18n_deals.json', 'r', encoding='utf-8') as f:
            i18n_deals = json.load(f)
    except:
        i18n_deals = {}

    # Initialize the "Global Dictionary"
    live_file = {}

    # 1. AUTO-DETECT & TRANSLATE BADGES
    unique_badges = set(tool.get('discount_amount', 'N/A') for tool in ai_deals if tool.get('discount_amount') != 'N/A')
    
    print(f"Checking {len(unique_badges)} unique badges...")
    for badge in unique_badges:
        # Check if we already have it in our i18n file
        found_trans = None
        for tool in i18n_deals.values():
            if tool.get('badge', {}).get('English') == badge:
                found_trans = tool.get('badge')
                break
        
        if found_trans:
            live_file[badge] = {LANG_MAP[k]: v for k, v in found_trans.items() if k in LANG_MAP}
        else:
            # If not found, we could trigger AI translation here
            # For now, we use a fallback or skip to keep it safe
            live_file[badge] = {"en": badge}

    # 2. SYNC TOOL DESCRIPTIONS
    for name, data in i18n_deals.items():
        entry = {}
        for lang_name, lang_code in LANG_MAP.items():
            entry[lang_code] = {
                "description": data.get("description", {}).get(lang_name, ""),
                "key_features": data.get("features", {}).get(lang_name, ""),
                "badge": data.get("badge", {}).get(lang_name, ""),
                "pricing": data.get("pricing", {}).get(lang_name, "")
            }
        live_file[name] = entry

    # Write to Live File
    output_path = 'src/i18n/tool-translations.json'
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(live_file, f, indent=2, ensure_ascii=False)
    
    print(f"Success! Updated {len(live_file)} entries.")

if __name__ == "__main__":
    sync()
