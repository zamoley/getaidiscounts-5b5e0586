import os
import json
from datetime import datetime

def clean_value(val):
    """Removes messy placeholders like OFFICIAL_URL or CODE_OR_NULL."""
    s_val = str(val).strip()
    placeholders = ["OFFICIAL_URL", "CODE_OR_NULL", "NULL", "Not Applicable", "not specified"]
    if any(p.lower() in s_val.lower() for p in placeholders) or len(s_val) < 2:
        return "N/A"
    return s_val

def main():
    if not os.path.exists("ai_deals.json"):
        print("Error: ai_deals.json not found.")
        return

    with open("ai_deals.json", "r") as f:
        try:
            raw_data = json.load(f)
        except:
            print("Error: Could not read JSON.")
            return

    # THE BOUNCER LOGIC
    # We use a dictionary where the key is the tool name. 
    # This automatically deletes duplicates!
    unique_tools = {}

    for item in raw_data:
        name = str(item.get("tool_name", "Unknown")).strip()
        url = str(item.get("tool_url", ""))
        
        # QUALITY CHECK:
        # If we already have this tool, we only replace it if the NEW one has a real URL.
        # This keeps the version with the working logo/link!
        is_placeholder = "official_url" in url.lower() or len(url) < 5
        
        if name not in unique_tools or (unique_tools[name]['is_placeholder'] and not is_placeholder):
            # Clean the data before saving
            clean_item = {
                "tool_name": name,
                "tool_url": clean_value(item.get("tool_url")),
                "code": clean_value(item.get("code")),
                "discount_amount": clean_value(item.get("discount_amount")),
                "pricing_info": clean_value(item.get("pricing_info")),
                "key_features": clean_value(item.get("key_features")),
                "description": clean_value(item.get("description")),
                "last_verified": str(item.get("last_verified", datetime.now().strftime('%Y-%m-%d'))),
                "category": clean_value(item.get("category")),
                "is_placeholder": is_placeholder # Internal flag for cleaning
            }
            unique_tools[name] = clean_item

    # Remove the internal flag and convert back to a list
    final_list = []
    for t in unique_tools.values():
        del t['is_placeholder']
        final_list.append(t)

    # Save the perfectly clean list
    with open("ai_deals.json", "w") as f:
        json.dump(final_list, f, indent=4)
    
    print(f"Cleanup complete! Removed duplicates. {len(final_list)} unique tools remain.")

if __name__ == "__main__":
    main()
