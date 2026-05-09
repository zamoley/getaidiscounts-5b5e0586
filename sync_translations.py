import json
import os

# ISO Map for output consistency
LANG_CODES = ["en", "ja", "uk", "es", "pt", "fr", "de", "zh", "it"]

def sync():
    # 1. LOAD SOURCE DATA
    if not os.path.exists("ai_deals.json") or not os.path.exists("src/i18n/i18n_deals.json"):
        print("Source files missing. Skipping sync.")
        return

    with open("ai_deals.json", "r", encoding="utf-8") as f:
        ai_deals = json.load(f)
    with open("src/i18n/i18n_deals.json", "r", encoding="utf-8") as f:
        translations = json.load(f)

    live_file = {}

    # --- STEP 1: SMART DICTIONARY (FIXES ENGLISH BADGES) ---
    # This maps English strings like "20% OFF" to their translations
    for tool in ai_deals:
        p = tool.get("pricing_info", "N/A")
        b = tool.get("discount_amount", "N/A")
        t_name = tool.get("tool_name")

        if t_name in translations:
            t_data = translations[t_name]
            # Use the new ISO-based keys from translator.py
            # Map pricing string to its translation object
            live_file[p] = t_data.get("pricing", {})
            # Map badge/discount string to its translation object
            live_file[b] = t_data.get("discount", {})

    # --- STEP 2: TOOL DESCRIPTIONS & FEATURES ---
    # This provides the detailed info for each tool card and comparison window
    for name, data in translations.items():
        entry = {}
        for lang in LANG_CODES:
            entry[lang] = {
                "description": data.get("description", {}).get(lang, ""),
                "features": data.get("features", {}).get(lang, ""),
                # UI expects "badge", so we map our new "discount" key to it
                "badge": data.get("discount", {}).get(lang, ""),
                "pricing": data.get("pricing", {}).get(lang, "")
            }
        live_file[name] = entry

    # --- STEP 3: SAVE TO LIVE SITE ---
    output_path = "src/i18n/tool-translations.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(live_file, f, indent=2, ensure_ascii=False)

    print(f"✅ Synced {len(live_file)} tools and UI strings to the live dictionary.")

if __name__ == "__main__":
    sync()
