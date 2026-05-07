import os
import json
import requests
from datetime import datetime

# ... (Keep search_tavily, call_ai, and discover_categories as they are) ...

def main():
    # ... (Keep your harvesting loop) ...

    # --- THE ROBUST CLEANER ---
    final_data = []
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            try:
                existing = json.load(f)
                for item in existing:
                    clean_item = {}
                    for key, val in item.items():
                        if isinstance(val, dict):
                            # Extract the value if it exists, otherwise use string version
                            if key in val: clean_item[key] = str(val[key])
                            elif "name" in val: clean_item[key] = str(val["name"])
                            elif val: clean_item[key] = str(next(iter(val.values())))
                            else: clean_item[key] = "N/A"
                        elif isinstance(val, list):
                            clean_item[key] = ", ".join([str(i) for i in val])
                        else:
                            clean_item[key] = str(val) if val is not None else "N/A"
                    final_data.append(clean_item)
            except Exception as e:
                print(f"Cleanup Error: {e}")

    with open("ai_deals.json", "w") as f:
        json.dump(final_data, f, indent=4)
