import os
import json
import requests
import time
from datetime import datetime

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

LANGUAGES = {
    "en": "English",
    "uk": "Ukrainian",
    "ja": "Japanese",
    "es": "Spanish",
    "pt": "Portuguese",
    "fr": "French",
    "de": "German",
    "zh": "Chinese",
    "it": "Italian"
}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "system", "content": "You are a translation expert that outputs ONLY valid JSON."}, 
                     {"role": "user", "content": prompt}],
        "response_format": {"type": "json_object"}
    }
    try:
        print("Waiting 22s for rate limits...")
        time.sleep(22)
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=30)
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"Translation Error: {e}")
        return None

def main():
    if not os.path.exists("ai_deals.json"):
        print("ai_deals.json not found!")
        return

    with open("ai_deals.json", "r") as f:
        deals = json.load(f)

    # 1. Handle Tool Translations
    i18n_deals = {}
    if os.path.exists("i18n_deals.json"):
        with open("i18n_deals.json", "r") as f:
            i18n_deals = json.load(f)

    # 2. Handle Category Translations
    i18n_cats = {}
    if os.path.exists("i18n_categories.json"):
        with open("src/i18n_categories.json", "r") as f:
            i18n_cats = json.load(f)

    # Extract all unique categories
    all_categories = list(set([d.get('category', 'General AI') for d in deals]))

    # --- Translate Categories ---
    for cat in all_categories:
        if cat in i18n_cats: continue
        print(f"Translating Category: {cat}...")
        prompt = f"Translate the AI category name '{cat}' into these languages: {', '.join(LANGUAGES.values())}. Return JSON: {{'en': '...', 'uk': '...', ...}}"
        res = call_ai(prompt)
        if res:
            i18n_cats[cat] = json.loads(res)
            with open("i18n_categories.json", "w") as f:
                json.dump(i18n_cats, f, indent=4, ensure_ascii=False)

    # --- Translate Tools ---
    for tool in deals:
        name = tool['tool_name']
        if name in i18n_deals: continue
        print(f"Translating Tool: {name}...")
        prompt = f"Translate the description and features for '{name}' into these languages: {', '.join(LANGUAGES.values())}. Description: {tool['description']}. Features: {tool['key_features']}. Return JSON: {{'uk': {{'description': '...', 'features': '...'}}, ...}}"
        res = call_ai(prompt)
        if res:
            i18n_deals[name] = json.loads(res)
            with open("i18n_deals.json", "w") as f:
                json.dump(i18n_deals, f, indent=4, ensure_ascii=False)

    print("Localization complete.")

if __name__ == "__main__":
    main()
