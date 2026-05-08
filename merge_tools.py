import json

# Define the mapping of duplicate names to their canonical "winner"
MERGE_MAP = {
    "Copy.AI": "Copy.ai",
    "CopyAI": "Copy.ai",
    "Microsoft Azure Cognitive Services Speech": "Microsoft Azure Speech",
    "Microsoft Azure Speech Services": "Microsoft Azure Speech",
    "Zapier AI": "Zapier with AI",
    "Google Cloud TTS": "Google Cloud Text-to-Speech",
    "VoiceType": "VoiceType AI"
}

def merge_db():
    with open('ai_deals.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    cleaned_data = {}

    for tool in data:
        name = tool['tool_name']
        # If the name is in our merge list, use the canonical name instead
        canonical_name = MERGE_MAP.get(name, name)
        
        if canonical_name not in cleaned_data:
            tool['tool_name'] = canonical_name
            cleaned_data[canonical_name] = tool
        else:
            # MERGE LOGIC: Keep the best data from both
            existing = cleaned_data[canonical_name]
            
            # Prefer non-"N/A" descriptions
            if existing['description'] == "N/A" and tool['description'] != "N/A":
                existing['description'] = tool['description']
            
            # Prefer valid URLs
            if existing['tool_url'] == "N/A" and tool['tool_url'] != "N/A":
                existing['tool_url'] = tool['tool_url']

            # Prefer specific discounts over "N/A"
            if existing['discount_amount'] == "N/A" and tool['discount_amount'] != "N/A":
                existing['discount_amount'] = tool['discount_amount']
                existing['code'] = tool['code']

    # Convert back to list and save
    final_list = list(cleaned_data.values())
    with open('ai_deals.json', 'w', encoding='utf-8') as f:
        json.dump(final_list, f, indent=4, ensure_ascii=False)
    
    print(f"Merge Complete! Reduced {len(data)} tools to {len(final_list)}.")

if __name__ == "__main__":
    merge_db()
