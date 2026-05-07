import os
import json
import requests
import time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {
    "en": "English", "uk": "Ukrainian", "ja": "Japanese", 
    "es": "Spanish", "pt": "Portuguese", "fr": "French", 
    "de": "German", "zh": "Chinese", "it": "Italian"
}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini", 
        "messages": [
            {"role": "system", "content": "You are a translation expert. IMPORTANT: For Ukrainian, always use 'ШІ' for 'AI' (not 'штучний інтелект'). Translate EVERYTHING, including short words like 'OFF', 'Credits', and 'Starts at'. Return ONLY valid JSON."}, 
            {"role": "user", "content": prompt}
        ], 
        "response_format": {"type": "json_object"}
    }
    try:
        time.sleep(22) # Rate limit safety
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        return response.json()['choices'][0]['message']['content'] if response.status_code == 200 else None
    except: return None

def main():
    os.makedirs("src/i18n", exist_ok=True)
    with open("ai_deals.json", "r") as f: deals = json.load(f)

    # 1. BATCH CATEGORY TRANSLATION (Ensures Uniformity)
    i18n_cats_path = "src/i18n/i18n_categories.json"
    all_cats = list(set([d.get('category', 'General AI') for d in deals]))
    print(f"Translating {len(all_cats)} categories in batch...")
    cat_prompt = f"Translate these AI categories into {list(LANGUAGES.values())}: {all_cats}. Format: {{'CategoryName': {{'en': '...', 'uk': '...', ...}}}}"
    cat_res = call_ai(cat_prompt)
    if cat_res:
        with open(i18n_cats_path, "w") as f:
            json.dump(json.loads(cat_res), f, indent=4, ensure_ascii=False)

    # 2. TOOL TRANSLATIONS (Enforcing Format A)
    i18n_deals_path = "src/i18n/i18n_deals.json"
    # We start with an empty dict to WIPE the old messy formats
    new_i18n = {}

    for tool in deals:
        name = str(tool['tool_name'])
        print(f"Translating: {name}...")
        prompt = f"""
        Translate these fields for '{name}' into {list(LANGUAGES.values())}:
        - description: {tool['description']}
        - features: {tool['key_features']}
        - badge: {tool['discount_amount']}
        - pricing: {tool['pricing_info']}
        
        STRICT FORMAT: {{ '{name}': {{ 'en': {{ 'description': '...', 'badge': '...' }}, 'uk': {{ ... }} }} }}
        """
        res = call_ai(prompt)
        if res:
            try:
                # We extract the inner data to keep the file structure clean
                tool_data = json.loads(res)
                # If the AI wrapped it in the tool name, unwrap it
                new_i18n[name] = tool_data.get(name, tool_data)
                
                # Save progress after each tool
                with open(i18n_deals_path, "w") as f:
                    json.dump(new_i18n, f, indent=4, ensure_ascii=False)
            except: print(f"Error on {name}")

    print("Success! The translation engine is now unified.")

if __name__ == "__main__":
    main()
