import os
import json
import re
from datetime import datetime

def normalize(name):
    """Turns 'HappyHorse-1.0' or 'Kling 3.0' into 'happyhorse' or 'kling'."""
    n = str(name).lower().strip()
    # Remove version numbers, 'ai', and special characters
    n = re.sub(r'[^a-z0-9]', '', n)
    n = n.replace('ai', '').replace('v1', '').replace('v2', '').replace('v3', '')
    return "".join(re.split(r'\d+', n)) # Removes numbers to match versions

def is_working(url):
    u = str(url).lower()
    return len(u) > 10 and not any(p in u for p in ["n/a", "official", "null", "none"])

def main():
    if not os.path.exists("ai_deals.json"): return
    with open("ai_deals.json", "r") as f:
        try: deals = json.load(f)
        except: return

    # THE MASTER BOUNCER: Only one tool per 'Stem Name'
    unique_database = {}

    for tool in deals:
        original_name = str(tool.get('tool_name', 'Unknown')).strip()
        stem = normalize(original_name)
        url = tool.get('tool_url', 'N/A')
        working = is_working(url)

        # PRIORITY RULE: If we find a duplicate, keep the one that actually WORKS.
        if stem not in unique_database or (not unique_database[stem]['is_working'] and working):
            clean_item = {
                "tool_name": original_name,
                "tool_url": url if working else "N/A",
                "code": str(tool.get("code", "N/A")),
                "discount_amount": str(tool.get("discount_amount", "N/A")),
                "pricing_info": str(tool.get("pricing_info", "N/A")),
                "key_features": str(tool.get("key_features", "N/A")),
                "description": str(tool.get("description", "N/A")),
                "last_verified": str(tool.get("last_verified", datetime.now().strftime('%Y-%m-%d'))),
                "category": str(tool.get("category", "General AI")),
                "is_working": working
            }
            unique_database[stem] = clean_item

    # Convert back to list and remove internal flag
    final_list = []
    for t in unique_database.values():
        del t['is_working']
        final_list.append(t)

    with open("ai_deals.json", "w") as f:
        json.dump(final_list, f, indent=4)
    print(f"Sanitization Complete. {len(final_list)} unique tools remaining.")

if __name__ == "__main__":
    main()
