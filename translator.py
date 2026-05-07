import os, json, requests, time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish", "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

def call_ai(prompt):
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o-mini", "messages": [{"role": "system", "content": "Translate EVERY field (including OFF, Credits, Price). Use 'ШІ' for AI in Ukrainian."}, {"role": "user", "content": prompt}], "response_format": {"type": "json_object"}}
    try:
        time.sleep(22)
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        return res.json()['choices'][0]['message']['content']
    except: return None

def main():
    os.makedirs("src/i18n", exist_ok=True)
    with open("ai_deals.json", "r") as f: deals = json.load(f)
    
    # WE START FRESH TO ENSURE NO MISSING FIELDS
    i18n_deals = {} 
    
    for tool in deals:
        name = str(tool['tool_name'])
        print(f"Translating: {name}...")
        prompt = f"Translate for '{name}' into {list(LANGUAGES.values())}: Desc: {tool['description']}, Feats: {tool['key_features']}, Badge: {tool['discount_amount']}, Price: {tool['pricing_info']}. Return JSON keys: description, features, badge, pricing."
        res = call_ai(prompt)
        if res:
            i18n_deals[name] = json.loads(res)
            with open("src/i18n/i18n_deals.json", "w") as f:
                json.dump(i18n_deals, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    main()
