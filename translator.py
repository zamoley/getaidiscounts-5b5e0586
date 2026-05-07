# ... (Keep imports and call_ai) ...

def main():
    os.makedirs("src/i18n", exist_ok=True)
    deals_path = "ai_deals.json"
    i18n_path = "src/i18n/i18n_deals.json"

    with open(deals_path, "r") as f:
        deals = json.load(f)

    i18n_deals = {}
    if os.path.exists(i18n_path):
        with open(i18n_path, "r") as f:
            i18n_deals = json.load(f)

    for tool in deals:
        name = str(tool.get('tool_name', 'Unknown'))
        
        # AGGRESSIVE CHECK: If 'badge' doesn't exist for English, re-translate everything
        if name in i18n_deals and "badge" in i18n_deals[name].get("en", {}):
            print(f"Skipping {name} (Already complete)")
            continue

        print(f"Translating {name} (New or fixing missing fields)...")
        # ... (Keep your prompt and AI call) ...
