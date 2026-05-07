import os, json, re
from datetime import datetime

def stem_name(name):
    """Turns 'Midjourney v7' or 'HappyHorse Text-to-video' into just 'midjourney' or 'happyhorse'."""
    n = str(name).lower().strip()
    # Remove version numbers, suffixes, and noise
    n = re.sub(r'( v\d+| version \d+| ai| text-to-video| text to video| pro| tools| online)', '', n)
    return re.sub(r'[^a-z0-9]', '', n)

def main():
    if not os.path.exists("ai_deals.json"): return
    with open("ai_deals.json", "r") as f:
        try: deals = json.load(f)
        except: return

    # THE AGGRESSIVE BOUNCER
    unique_database = {}
    for tool in deals:
        name = str(tool.get('tool_name', 'Unknown')).strip()
        stem = stem_name(name)
        url = str(tool.get('tool_url', 'N/A'))
        
        # QUALITY SCORE: Higher score = Better data
        score = 0
        if len(url) > 10 and "N/A" not in url: score += 10
        if len(str(tool.get('description', ''))) > 20: score += 5
        
        if stem not in unique_database or score > unique_database[stem]['score']:
            tool['tool_name'] = name # Keep original name but unique stem
            tool['score'] = score
            unique_database[stem] = tool

    # Final Save
    final_list = []
    for t in unique_database.values():
        del t['score']
        final_list.append(t)

    with open("ai_deals.json", "w") as f:
        json.dump(final_list, f, indent=4)
    print(f"Cleaned! {len(final_list)} unique tools remain.")

if __name__ == "__main__":
    main()
