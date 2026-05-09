import json
import os

# Define the 2-letter language map used by your frontend
LANG_MAP = {
    "English": "en",
    "Japanese": "ja",
    "Ukrainian": "uk",
    "Spanish": "es",
    "Portuguese": "pt",
    "French": "fr",
    "German": "de",
    "Chinese": "zh",
    "Italian": "it"
}

def sync():
    # 1. Load your master English database
    with open('ai_deals.json', 'r', encoding='utf-8') as f:
        master_deals = json.load(f)

    # 2. Load the translations I provided (if you saved them in i18n_deals.json)
    # If the file is missing, we will create a fresh one
    try:
        with open('src/i18n/i18n_deals.json', 'r', encoding='utf-8') as f:
            translations = json.load(f)
    except FileNotFoundError:
        print("Error: i18n_deals.json not found. Please ensure it exists in src/i18n/")
        return

    new_tool_translations = {}

    for tool_name, data in translations.items():
        # Transform the data structure into the 2-letter code format
        # Structure: { "ja": { "description": "...", "key_features": "...", "badge": "...", "pricing": "..." } }
        tool_entry = {}
        
        for lang_name, lang_code in LANG_MAP.items():
            tool_entry[lang_code] = {
                "description": data["description"].get(lang_name, ""),
                "key_features": data["features"].get(lang_name, ""),
                "badge": data["badge"].get(lang_name, ""),
                "pricing": data["pricing"].get(lang_name, "")
            }
        
        new_tool_translations[tool_name] = tool_entry

    # 3. Write to the file the site ACTUALLY uses
    # Note: Using 'src/i18n/tool-translations.json'
    output_path = 'src/i18n/tool-translations.json'
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(new_tool_translations, f, indent=2, ensure_ascii=False)
    
    print(f"Success! Updated {len(new_tool_translations)} tools in tool-translations.json")

if __name__ == "__main__":
    sync()
