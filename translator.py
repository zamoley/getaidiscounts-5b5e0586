import os
import json
import requests
import time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "system", "content": "Translate to 9 languages. Return JSON."}, {"role": "user", "content": prompt}], "response_format": {"type": "json_object"}}
    time.sleep(22)
    res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    return res.json()['choices'][0]['message']['content']

def main():
    # Force creation of the directory
    os.makedirs("src/i18n", exist_ok=True)
    
    # We will do just ONE tool to start, to guarantee a fast success
    with open("ai_deals.json", "r") as f:
        deals = json.load(f)
    
    tool = deals[0] # Just the first one
    name = tool['tool_name']
    
    print(f"INITIALIZING: {name}...")
    prompt = f"Translate for '{name}' into {list(LANGUAGES.values())}: Desc: {tool['description']}, Features: {tool['key_features']}, Badge: {tool['discount_amount']}, Pricing: {tool['pricing_info']}. Return JSON keys: description, features, badge, pricing."
    res = call_ai(prompt)
    
    if res:
        # Create the file fresh
        i18n_deals = {name: json.loads(res)}
        with open("src/i18n/i18n_deals.json", "w") as f:
            json.dump(i18n_deals, f, indent=4, ensure_ascii=False)
        
        # Create categories fresh
        all_cats = list(set([d.get('category', 'General AI') for d in deals]))
        cat_prompt = f"Translate categories: {all_cats} into {list(LANGUAGES.values())}"
        cat_res = call_ai(cat_prompt)
        if cat_res:
            with open("src/i18n/i18n_categories.json", "w") as f:
                json.dump(json.loads(cat_res), f, indent=4, ensure_ascii=False)

    print("Initialization complete. Files created.")

if __name__ == "__main__":
    main()
