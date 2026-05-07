import toolTranslations from "./tool-translations.json";
import dealsTranslations from "./i18n_deals.json";
import type { LangCode } from "./index";

type ToolEntry = Partial<Record<Exclude<LangCode, "en">, { description?: string; key_features?: string }>>;
const map = toolTranslations as Record<string, ToolEntry>;

// Strict shape: { "<ToolName>": { "<lang>": { description, features, badge, pricing } } }
type LocaleFields = {
  description?: string;
  features?: string;
  badge?: string;
  pricing?: string;
};
type DealEntry = Partial<Record<LangCode, LocaleFields>>;

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
  return field === "key_features" ? "features" : field;
}

function pickFromEntry(entry: DealEntry | undefined, locale: LangCode, field: ToolField): string | undefined {
  const v = entry?.[locale]?.[fieldKey(field)];
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
