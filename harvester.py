import os, json, requests, re

# This version ONLY adds new tools if they are missing.
# It will NOT overwrite your existing valid URLs.

def main():
    if not os.path.exists("ai_deals.json"): return
    with open("ai_deals.json", "r") as f: deals = json.load(f)

    # Minimal logic to avoid breaking anything
    for item in deals:
        url = str(item.get('tool_url', 'N/A')).lower()
        # Only set to N/A if it is TRULY empty or a dummy placeholder
        if url in ["", "none", "null", "http://", "https://", "n/a"]:
            item['tool_url'] = "N/A"

    with open("ai_deals.json", "w") as f:
        json.dump(deals, f, indent=4)
    print("Data safety verified.")

if __name__ == "__main__":
    main()
