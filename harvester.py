import os
import json
import requests
from datetime import datetime

# ... (Keep your API keys and search functions at the top) ...

def main():
    database = []
    # ... (Keep your categories and searching logic) ...

    # --- THE DATA CLEANER ---
    final_data = []
    if os.path.exists("ai_deals.json"):
        with open("ai_deals.json", "r") as f:
            existing = json.load(f)
            
            # This loop fixes the "Object" names and nested data
            for item in existing:
                cleaned_item = {}
                for key, val in item.items():
                    if isinstance(val, dict):
                        # Extract the string if AI nested it (e.g. {"name": "Semrush"})
                        if key in val: cleaned_item[key] = str(val[key])
                        elif "name" in val: cleaned_item[key] = str(val["name"])
                        else: cleaned_item[key] = str(list(val.values())[0])
                    elif isinstance(val, list):
                        cleaned_item[key] = ", ".join([str(i) for i in val])
                    else:
                        cleaned_item[key] = str(val) if val is not None else ""
                final_data.append(cleaned_item)

    # Add new harvested deals with the same cleaning logic
    for d in database:
        # (Cleaning logic for new deals...)
        pass 

    # Save the cleaned database
    with open("ai_deals.json", "w") as f:
        json.dump(final_data, f, indent=4)
