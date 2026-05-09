import os, json, requests, time

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
LANGUAGES = {"en": "English", "uk": "Ukrainian", "ja": "Japanese", "es": "Spanish",
             "pt": "Portuguese", "fr": "French", "de": "German", "zh": "Chinese", "it": "Italian"}

# ISO codes that must all be present for a tool to be considered fully translated
REQUIRED_ISO = set(LANGUAGES.keys())


def call_ai(prompt):
    """Call OpenAI with the prompt as a user message and return the response string."""
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "You are a professional translator. Use 'ШІ' for AI in Ukrainian. Always return valid JSON with ISO keys (en, uk, ja, es, pt, fr, de, zh, it)."
            },
            {
                "role": "user",        # FIX: prompt was passed in but never added to the payload
                "content": prompt
            }
        ],
        "response_format": {"type": "json_object"}
    }
    try:
        time.sleep(22)  # Tier 1 rate limit safety
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=45)
        if res.status_code != 200:
            print(f"⚠️ OpenAI error {res.status_code}: {res.text[:200]}")
            return None
        return res.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"⚠️ call_ai error: {e}")
        return None


def is_fully_translated(entry):
    """
    FIX: Old check used ISO keys ('ja', 'uk') but i18n_deals.json uses full names
    ('Japanese', 'Ukrainian'), so the skip condition always failed and every tool
    got retranslated on every run.

    New check: a tool is fully translated if ALL 9 ISO codes are present and non-empty
    in its 'description' field. Handles both ISO-keyed entries (written by this script)
    and full-name-keyed entries (legacy format).
    """
    desc = entry.get('description', {})
    desc_keys = set(desc.keys())

    # Case 1: entry already uses ISO keys (written by this script)
    if REQUIRED_ISO.issubset(desc_keys):
        return all(str(desc.get(iso, '')).strip() for iso in REQUIRED_ISO)

    # Case 2: entry uses full language names (legacy format)
    full_names = set(LANGUAGES.values())
    if full_names.issubset(desc_keys):
        return all(str(desc.get(name, '')).strip() for name in full_names)

    # Partially translated or empty — needs a translation run
    return False


def main():
    os.makedirs("src/i18n", exist_ok=True)

    if not os.path.exists("ai_deals.json"):
        print("ai_deals.json not found. Skipping.")
        return

    try:
        with open("ai_deals.json", "r", encoding="utf-8") as f:
            deals = json.load(f)
    except Exception as e:
        print(f"❌ Failed to load ai_deals.json: {e}")
        return

    i18n_deals_path = "src/i18n/i18n_deals.json"
    i18n_deals = {}
    if os.path.exists(i18n_deals_path):
        try:
            with open(i18n_deals_path, "r", encoding="utf-8") as f:
                i18n_deals = json.load(f)
        except Exception as e:
            print(f"❌ Failed to load {i18n_deals_path}: {e}")
            return

    for tool in deals:
        name = tool.get('tool_name', '').strip()
        if not name:
            continue

        # FIX: Skip tools with no valid URL — prevents ghost entries from being
        # re-added to i18n_deals after they were cleaned out
        url = str(tool.get('tool_url', '') or '').strip()
        if not url or url.lower() == 'n/a' or '.' not in url:
            print(f"⏭️  Skipping {name} — no valid URL.")
            continue

        # FIX: Correct skip check — works for both ISO and full-name keyed entries
        if name in i18n_deals and is_fully_translated(i18n_deals[name]):
            print(f"✅ {name} already fully translated. Skipping.")
            continue

        print(f"🌐 Translating: {name}...")
        prompt = f"""
Translate the following AI tool information for '{name}' into all 9 languages.
Use these ISO language codes: en, uk, ja, es, pt, fr, de, zh, it.

1. Description: {tool.get('description', 'N/A')}
2. Key Features: {tool.get('key_features', 'N/A')}
3. Discount Amount: {tool.get('discount_amount', 'N/A')}
4. Pricing Info: {tool.get('pricing_info', 'N/A')}

Return a JSON object with exactly these keys and all 9 ISO codes in each:
{{
    "description": {{ "en": "...", "uk": "...", "ja": "...", "es": "...", "pt": "...", "fr": "...", "de": "...", "zh": "...", "it": "..." }},
    "features":    {{ "en": "...", "uk": "...", "ja": "...", "es": "...", "pt": "...", "fr": "...", "de": "...", "zh": "...", "it": "..." }},
    "discount":    {{ "en": "...", "uk": "...", "ja": "...", "es": "...", "pt": "...", "fr": "...", "de": "...", "zh": "...", "it": "..." }},
    "pricing":     {{ "en": "...", "uk": "...", "ja": "...", "es": "...", "pt": "...", "fr": "...", "de": "...", "zh": "...", "it": "..." }}
}}
"""
        raw = call_ai(prompt)
        if raw:
            try:
                parsed = json.loads(raw)
                i18n_deals[name] = parsed
                # Write after every tool so progress is saved if the run is interrupted
                with open(i18n_deals_path, "w", encoding="utf-8") as f:
                    json.dump(i18n_deals, f, indent=4, ensure_ascii=False)
                print(f"  ✓ Saved {name}")
            except Exception as e:
                print(f"⚠️ Failed to parse translation for {name}: {e}")
        else:
            print(f"⚠️ No translation returned for {name}. Skipping.")

    print(f"✅ Translation complete. {len(i18n_deals)} tools in i18n_deals.json.")


if __name__ == "__main__":
    main()
