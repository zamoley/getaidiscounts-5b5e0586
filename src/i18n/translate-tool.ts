import toolTranslations from "./tool-translations.json";
import dealsTranslations from "./i18n_deals.json";
import type { LangCode } from "./index";

type ToolEntry = Partial<Record<Exclude<LangCode, "en">, { description?: string; key_features?: string }>>;
const map = toolTranslations as Record<string, ToolEntry>;

// i18n_deals.json shape:
//   { "<ToolName>": { "<Language Name>": { description, features, badge, pricing } } }
const LANG_NAME: Record<LangCode, string> = {
  en: "English",
  zh: "Chinese",
  ja: "Japanese",
  es: "Spanish",
  de: "German",
  fr: "French",
  it: "Italian",
  uk: "Ukrainian",
  pt: "Portuguese",
};

type LocaleFields = {
  description?: string;
  features?: string;
  badge?: string;
  pricing?: string;
};
type DealEntry = Record<string, LocaleFields>;

export const translations = dealsTranslations as unknown as Record<string, DealEntry>;

const dealsLowerMap: Record<string, DealEntry> = Object.fromEntries(
  Object.entries(translations).map(([k, v]) => [k.toLowerCase().trim(), v])
);

function lookupDeal(toolName: string): DealEntry | undefined {
  if (!toolName) return undefined;
  return translations[toolName] ?? dealsLowerMap[toolName.toLowerCase().trim()];
}

export type ToolField = "description" | "key_features" | "badge" | "pricing";

function fieldKey(field: ToolField): keyof LocaleFields {
  if (field === "description") return "description";
  if (field === "key_features") return "features";
  if (field === "badge") return "badge";
  return "pricing";
}

function pickFromEntry(entry: DealEntry | undefined, locale: LangCode, field: ToolField): string | undefined {
  if (!entry) return undefined;
  const langBlock = entry[LANG_NAME[locale]] ?? entry[locale];
  const v = langBlock?.[fieldKey(field)];
  return typeof v === "string" && v.trim() ? v : undefined;
}

export function translateTool(
  toolName: string,
  locale: LangCode,
  field: ToolField,
  fallback?: string
): string | undefined {
  const entry = lookupDeal(toolName);

  const localized = pickFromEntry(entry, locale, field);
  if (localized) return localized;

  const en = pickFromEntry(entry, "en", field);
  if (en) return en;

  // Legacy tool-translations.json fallback for description/key_features
  if (locale !== "en" && (field === "description" || field === "key_features")) {
    const legacy = map[toolName]?.[locale as Exclude<LangCode, "en">]?.[field];
    if (legacy) return legacy;
  }
  return fallback;
}

export function translateField(
  toolName: string,
  locale: LangCode,
  field: ToolField
): string | undefined {
  return translateTool(toolName, locale, field);
}
