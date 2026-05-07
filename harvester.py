import os
import json
import requests
from datetime import datetime

# ... (Keep search_tavily, call_ai, and discover_categories at the top) ...

def force_string(val):
    """Deep-cleans any data into a single, clean string."""
    if val is None: return "N/A"
    if isinstance(val, dict):
        # Extract any text found inside the object
        if not val: return "N/A"
        # Try to find common keys like 'name', 'text', etc.
        for k in ['name', 'text', 'value', 'url']:
            if k in val: return str(val[k])
        # Fallback: just take the first value found
        return str(next(iter(val.values())))
    if isinstance(val, list):
        return ", ".join([force_string(x) for x in val])
    return str(val).strip()

def main():
    # 1. Load and Fix the entire database
    final_data = []
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            try:
                raw_data = json.load(f)
                for item in raw_data:
                    clean_item = {}
                    # We define the keys we want
                    fields = ["tool_name", "tool_url", "code", "discount_amount", "pricing_info", "key_features", "description", "last_verified", "category"]
                    for field in fields:
                        clean_item[field] = force_string(item.get(field))
                    final_data.append(clean_item)
            except: print("Corruption found, skipping load.")

    # 2. Save the perfectly flat database
    with open("ai_deals.json", "w") as f:
        json.dump(final_data, f, indent=4)
    print(f"CLEANED: {len(final_data)} tools are now 100% strings.")

if __name__ == "__main__":
    main()
