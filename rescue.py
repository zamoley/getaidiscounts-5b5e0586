import json, os

def rescue():
    if not os.path.exists("ai_deals.json"): 
        print("ai_deals.json not found!")
        return
    
    with open("ai_deals.json", "r") as f:
        deals = json.load(f)

    # Manual fixes for your top tools (Add any others you want to save)
    fixes = {
        "Midjourney": "https://www.midjourney.com",
        "ElevenLabs": "https://elevenlabs.io",
        "HeyGen": "https://www.heygen.com",
        "Perplexity": "https://www.perplexity.ai",
        "Cursor": "https://www.cursor.com",
        "Lovable": "https://lovable.dev",
        "Synthesia": "https://www.synthesia.io",
        "Claude": "https://claude.ai",
        "ChatGPT": "https://chatgpt.com"
    }

    for item in deals:
        name = item.get('tool_name')
        if name in fixes:
            item['tool_url'] = fixes[name]
            print(f"Rescued: {name}")

    with open("ai_deals.json", "w") as f:
        json.dump(deals, f, indent=4)
    print("Done! URLs restored for key tools.")

if __name__ == "__main__":
    rescue()
