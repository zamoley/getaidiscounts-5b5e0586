import toolTranslations from "./tool-translations.json";
import dealsTranslations from "./i18n_deals.json";
import type { LangCode } from "./index";

// Map ISO locale codes to the full English language names used as keys
// inside i18n_deals.json (e.g. "ja" -> "Japanese").
const LANG_NAME: Record<LangCode, string> = {
  en: "English", uk: "Ukrainian", ja: "Japanese", es: "Spanish",
  pt: "Portuguese", fr: "French", de: "German", zh: "Chinese", it: "Italian",
};

// ---------- Flat string-keyed dictionary (tool-translations.json) ----------
// Shape: { "20% OFF": { en, uk, ja, ... } }
const stringDict = toolTranslations as unknown as Record<string, Partial<Record<LangCode, string>>>;
export function translateString(raw: string | undefined | null, locale: LangCode): string | undefined {
  if (!raw) return undefined;
  const entry = stringDict[raw];
  if (entry && typeof entry === "object") {
    const v = entry[locale];
    if (typeof v === "string" && v.trim()) return v;
  }
  return undefined;
}

// ---------- Tool-name dictionary (i18n_deals.json) ----------
// Actual shape: { "<ToolName>": { description: { English, Ukrainian, ... },
//                                  features:    { ... },
//                                  badge:       { ... },
//                                  pricing:     { ... } } }
type FieldKey = "description" | "features" | "badge" | "pricing";
type LangBag = Partial<Record<string, string>>;
type DealEntry = Partial<Record<FieldKey, LangBag>>;

export const translations = dealsTranslations as unknown as Record<string, DealEntry>;

const dealsLowerMap: Record<string, DealEntry> = Object.fromEntries(
  Object.entries(translations).map(([k, v]) => [k.toLowerCase().trim(), v])
);

function lookupDeal(toolName: string): DealEntry | undefined {
  if (!toolName) return undefined;
  return translations[toolName] ?? dealsLowerMap[toolName.toLowerCase().trim()];
}

export type ToolField = "description" | "key_features" | "badge" | "pricing";

function fieldKey(field: ToolField): FieldKey {
  if (field === "key_features") return "features";
  return field;
}

function pickFromEntry(entry: DealEntry | undefined, locale: LangCode, field: ToolField): string | undefined {
  if (!entry) return undefined;
  const bag = entry[fieldKey(field)];
  if (!bag) return undefined;
  const langName = LANG_NAME[locale];
  const v = bag[langName];
  if (typeof v === "string" && v.trim()) return v;
  return undefined;
}

export function translateTool(
  toolName: string,
  locale: LangCode,
  field: ToolField,
  fallback?: string
): string | undefined {
  const entry = lookupDeal(toolName);

  // 1. Per-tool localized value (primary)
  const localized = pickFromEntry(entry, locale, field);
  if (localized) return localized;

  // 2. Raw-string dictionary lookup (badges & pricing)
  if ((field === "badge" || field === "pricing") && fallback) {
    const byString = translateString(fallback, locale);
    if (byString) return byString;
  }

  // 3. Per-tool English value
  const en = pickFromEntry(entry, "en", field);
  if (en) return en;

  // 4. Raw English fallback from ai_deals.json
  return fallback;
}

export function translateField(
  toolName: string,
  locale: LangCode,
  field: ToolField
): string | undefined {
  return translateTool(toolName, locale, field);
}
