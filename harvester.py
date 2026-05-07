import os
import json
import requests
from datetime import datetime

# ... (Keep search_tavily, call_ai, and discover_categories the same) ...

def main():
    database = []
    # (Keep your harvesting loop here...)

    # --- THE DEEP CLEANER ---
    final_data = []
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            existing = json.load(f)
            for item in existing:
                clean_item = {}
                for key, val in item.items():
                    # FIX: If value is an object like {'name': 'DALL-E 3'}, extract the string
                    if isinstance(val, dict):
                        if key in val: clean_item[key] = str(val[key])
                        elif "name" in val: clean_item[key] = str(val["name"])
                        else: clean_item[key] = str(next(iter(val.values())))
                    elif isinstance(val, list):
                        clean_item[key] = ", ".join([str(i) for i in val])
                    else:
                        clean_item[key] = str(val) if val is not None else "N/A"
                final_data.append(clean_item)

    # Save the cleaned, flat database
    with open("ai_deals.json", "w") as f:
        json.dump(final_data, f, indent=4)
    print(f"Deep Clean complete. {len(final_data)} tools flattened.")

if __name__ == "__main__":
    main()
