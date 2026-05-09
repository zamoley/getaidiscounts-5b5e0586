import json, os

# Standard ISO mapping
LANG_MAP = {
    "en": ["en", "English"],
    "uk": ["uk", "Ukrainian"],
    "ja": ["ja", "Japanese"],
    "es": ["es", "Spanish"],
    "pt": ["pt", "Portuguese"],
    "fr": ["fr", "French"],
    "de": ["de", "German"],
    "zh": ["zh", "Chinese"],
    "it": ["it", "Italian"]
}

def get_val(data_dict, lang_key):
    """Deep lookup: handles ISO codes AND Full Names."""
    if not data_dict:
        return ""
    for variation in LANG_MAP.get(lang_key, [lang_key]):
        if variation in data_dict:
            return data_dict[variation]
    return ""

def sync():
    ai_path, i18n_path = "ai_deals.json", "src/i18n/i18n_deals.json"

    if not os.path.exists(ai_path) or not os.path.exists(i18n_path):
        print("Missing files. Sync skipped.")
        return

    try:
        with open(ai_path, "r", encoding="utf-8") as f:
            ai_deals = json.load(f)
    except Exception as e:
        print(f"❌ Failed to load {ai_path}: {e}")
        return

    try:
        with open(i18n_path, "r", encoding="utf-8") as f:
            translations = json.load(f)
    except Exception as e:
        print(f"❌ Failed to load {i18n_path}: {e}")
        return

    live_file = {}

    # 1. FIX THE BADGES & PRICING (stored under _badges namespace, not mixed with tool names)
    badges = {}
    for tool in ai_deals:
        p = tool.get("pricing_info", "N/A")
        b = tool.get("discount_amount", "N/A")
        t_name = tool.get("tool_name")
        if not t_name:
            continue
        if t_name in translations:
            t_data = translations[t_name]
            if p and p not in badges:
                badges[p] = {code: get_val(t_data.get("pricing", t_data.get("price", {})), code) for code in LANG_MAP}
            if b and b not in badges:
                badges[b] = {code: get_val(t_data.get("discount", t_data.get("badge", {})), code) for code in LANG_MAP}

    live_file["_badges"] = badges  # Namespaced separately so tool names never collide

    # 2. FIX THE CARDS (Descriptions & Features)
    for name, data in translations.items():
        if not name:
            continue
        live_file[name] = {
            code: {
                "description": get_val(data.get("description", {}), code),
                "features": get_val(data.get("features", {}), code),
                "badge": get_val(data.get("discount", data.get("badge", {})), code),
                "pricing": get_val(data.get("pricing", data.get("price", {})), code)
            } for code in LANG_MAP
        }

    output_path = "src/i18n/tool-translations.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(live_file, f, indent=2, ensure_ascii=False)
        print(f"✅ Sync complete. {len(live_file) - 1} tools written.")  # -1 for _badges key
    except Exception as e:
        print(f"❌ Failed to write {output_path}: {e}")

if __name__ == "__main__":
    sync()
