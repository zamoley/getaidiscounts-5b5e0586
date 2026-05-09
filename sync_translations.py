import json
import os

LANG_MAP = {
    "English": "en", "Japanese": "ja", "Ukrainian": "uk", "Spanish": "es",
    "Portuguese": "pt", "French": "fr", "German": "de", "Chinese": "zh", "Italian": "it"
}

def sync():
    try:
        with open('src/i18n/i18n_deals.json', 'r', encoding='utf-8') as f:
            translations = json.load(f)
    except FileNotFoundError:
        print("Error: i18n_deals.json not found in src/i18n/")
        return

    # THE SECRET SAUCE: A global dictionary for badges and pricing strings
    # This fixes the "Badges not translating" issue
    live_file = {
        "20% OFF": {"en": "20% OFF", "uk": "ЗНИЖКА 20%", "ja": "20% オフ", "es": "20% DTO", "pt": "20% DTO", "fr": "20% DE RABAIS", "de": "20% RABATT", "zh": "20% 折扣", "it": "20% DI SCONTO"},
        "10% OFF": {"en": "10% OFF", "uk": "ЗНИЖКА 10%", "ja": "10% オフ", "es": "10% DTO", "pt": "10% DTO", "fr": "10% DE RABAIS", "de": "10% RABATT", "zh": "10% 折扣", "it": "10% DI SCONTO"},
        "25% OFF": {"en": "25% OFF", "uk": "ЗНИЖКА 25%", "ja": "25% オフ", "es": "25% DTO", "pt": "25% DTO", "fr": "25% DE RABAIS", "de": "25% RABATT", "zh": "25% 折扣", "it": "25% DI SCONTO"},
        "Free Trial": {"en": "Free Trial", "uk": "Безкоштовна пробна версія", "ja": "無料トライアル", "es": "Prueba gratis", "pt": "Teste Grátis", "fr": "Essai gratuit", "de": "Kostenlose Testversion", "zh": "免费试用", "it": "Prova gratuita"},
        "Free Credits": {"en": "Free Credits", "uk": "Безкоштовні кредити", "ja": "無料クレジット", "es": "Créditos gratis", "pt": "Créditos grátis", "fr": "Crédits gratuits", "de": "Kostenlose Credits", "zh": "免费额度", "it": "Crediti gratuiti"}
    }

    for name, data in translations.items():
        entry = {}
        for lang_name, lang_code in LANG_MAP.items():
            entry[lang_code] = {
                "description": data.get("description", {}).get(lang_name, ""),
                "key_features": data.get("features", {}).get(lang_name, ""),
                "badge": data.get("badge", {}).get(lang_name, ""),
                "pricing": data.get("pricing", {}).get(lang_name, "")
            }
        live_file[name] = entry

    output_path = 'src/i18n/tool-translations.json'
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(live_file, f, indent=2, ensure_ascii=False)
    print(f"Updated {len(live_file)} entries in tool-translations.json")

if __name__ == "__main__":
    sync()
