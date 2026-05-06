import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import uk from "./locales/uk.json";
import pt from "./locales/pt.json";
import it from "./locales/it.json";
import categoriesMatrix from "./i18n_categories.json";

// Build per-language categories namespace from the single source of truth
// in i18n_categories.json so all locale files share the same labels.
function categoriesFor(lang: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, translations] of Object.entries(
    categoriesMatrix as Record<string, Record<string, string>>
  )) {
    const value = translations[lang] ?? translations.en ?? key;
    if (value) out[key] = value;
  }
  return out;
}

function withCategories(base: Record<string, unknown>, lang: string) {
  return { ...base, categories: { ...(base.categories as object ?? {}), ...categoriesFor(lang) } };
}

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", native: "English", flag: "🇺🇸" },
  { code: "zh", label: "Chinese (Simplified)", native: "简体中文", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "es", label: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "de", label: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "French", native: "Français", flag: "🇫🇷" },
  { code: "it", label: "Italian", native: "Italiano", flag: "🇮🇹" },
  { code: "uk", label: "Ukrainian", native: "Українська", flag: "🇺🇦" },
  { code: "pt", label: "Portuguese", native: "Português", flag: "🇧🇷" },
] as const;

export type LangCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const SUPPORTED_CODES = SUPPORTED_LANGUAGES.map(l => l.code) as readonly LangCode[];

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      ja: { translation: ja },
      es: { translation: es },
      de: { translation: de },
      fr: { translation: fr },
      uk: { translation: uk },
      pt: { translation: pt },
      it: { translation: it },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18n;
