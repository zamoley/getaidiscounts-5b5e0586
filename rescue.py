import json, os

def grand_rescue():
    file_path = "ai_deals.json"
    if not os.path.exists(file_path): return
    with open(file_path, "r") as f: deals = json.load(f)

    # Master list of correct URLs for your directory
    fixes = {
        "Midjourney": "https://www.midjourney.com",
        "ElevenLabs": "https://elevenlabs.io",
        "HeyGen": "https://www.heygen.com",
        "Perplexity": "https://www.perplexity.ai",
        "Cursor": "https://www.cursor.com",
        "Lovable": "https://lovable.dev",
        "Synthesia": "https://www.synthesia.io",
        "Claude": "https://claude.ai",
        "ChatGPT": "https://chatgpt.com",
        "Search Atlas": "https://searchatlas.com",
        "Writesonic": "https://writesonic.com",
        "Jasper": "https://www.jasper.ai",
        "Copy.ai": "https://www.copy.ai",
        "Grammarly": "https://www.grammarly.com",
        "Google Gemini": "https://gemini.google.com",
        "Replit": "https://replit.com",
        "Amazon Polly": "https://aws.amazon.com/polly/",
        "Microsoft Azure Speech": "https://azure.microsoft.com/services/cognitive-services/speech-services/",
        "Google Cloud TTS": "https://cloud.google.com/text-to-speech/",
        "Zapier AI": "https://zapier.com/ai",
        "Zapier with AI": "https://zapier.com/ai",
        "Canva Magic Studio": "https://www.canva.com/magic-studio/",
        "Adobe Firefly": "https://www.adobe.com/sensei/generative-ai/firefly.html",
        "Leonardo.ai": "https://leonardo.ai/",
        "Surfer SEO": "https://surferseo.com/",
        "Frase": "https://www.frase.io/",
        "MarketMuse": "https://www.marketmuse.com/",
        "WordHero": "https://wordhero.co/",
        "Writecream": "https://www.writecream.com/",
        "AssemblyAI": "https://www.assemblyai.com/",
        "Deepgram": "https://deepgram.com/",
        "Play.ht": "https://play.ht/",
        "Lovo.ai (Genny)": "https://lovo.ai/",
        "Resemble AI": "https://www.resemble.ai/",
        "Murf.ai": "https://murf.ai/",
        "Speechify": "https://speechify.com/",
        "Replicate": "https://replicate.com/",
        "Anyscale": "https://www.anyscale.com/",
        "Pinecone": "https://www.pinecone.io/",
        "OpenAI Codex": "https://openai.com/blog/openai-codex/",
        "GrowthBar": "https://www.growthbarseo.com/",
        "Semrush One": "https://www.semrush.com/",
        "Base44": "https://app.base44.com/register?ref=8HJWQQJCUB5KPWV9"
    }

    count = 0
    for item in deals:
        name = item.get('tool_name')
        if name in fixes:
            item['tool_url'] = fixes[name]
            count += 1
            print(f"Grand Rescue: {name}")

    with open(file_path, "w") as f:
        json.dump(deals, f, indent=4)
    print(f"Success! {count} URLs restored. Site is ready to go live.")

if __name__ == "__main__":
    grand_rescue()
