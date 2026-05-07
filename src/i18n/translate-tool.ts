import toolTranslations from "./tool-translations.json";
import dealsTranslations from "./i18n_deals.json";
import type { LangCode } from "./index";

type ToolEntry = Partial<Record<Exclude<LangCode, "en">, { description?: string; key_features?: string }>>;
const map = toolTranslations as Record<string, ToolEntry>;

// i18n_deals.json uses full language NAMES as inner keys, not ISO codes.
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

type FieldMatrix = Record<string, string>; // { English: "...", Japanese: "...", ... }
type DealEntry = {
  description?: FieldMatrix;
  features?: FieldMatrix;
  badge?: FieldMatrix;
  pricing?: FieldMatrix;
};

export const translations = dealsTranslations as unknown as Record<string, DealEntry>;

const dealsLowerMap: Record<string, DealEntry> = Object.fromEntries(
  Object.entries(translations).map(([k, v]) => [k.toLowerCase().trim(), v])
);

function lookupDeal(toolName: string): DealEntry | undefined {
  return translations[toolName] ?? dealsLowerMap[toolName.toLowerCase().trim()];
}

function pickField(matrix: FieldMatrix | undefined, locale: LangCode): string | undefined {
  if (!matrix) return undefined;
  const v = matrix[LANG_NAME[locale]] ?? matrix[locale];
  return typeof v === "string" && v.trim() ? v : undefined;
}

export type ToolField = "description" | "key_features" | "badge" | "pricing";

export function translateTool(
  toolName: string,
  locale: LangCode,
  field: ToolField,
  fallback?: string
): string | undefined {
  const entry = lookupDeal(toolName);
  const matrixKey: keyof DealEntry =
    field === "description" ? "description"
    : field === "key_features" ? "features"
    : field === "badge" ? "badge"
    : "pricing";

  const matrix = entry?.[matrixKey];
  const localized = pickField(matrix, locale);
  if (localized) return localized;

  const en = pickField(matrix, "en");
  if (en) return en;

  // Legacy tool-translations.json fallback for description/key_features
  if (locale !== "en" && (field === "description" || field === "key_features")) {
    const legacy = map[toolName]?.[locale as Exclude<LangCode, "en">]?.[field];
    if (legacy) return legacy;
  }
  return fallback;
}

// Convenience helper used by components for badge/pricing direct access.
export function translateField(
  toolName: string,
  locale: LangCode,
  field: ToolField
): string | undefined {
  return translateTool(toolName, locale, field);
}
