import toolTranslations from "./tool-translations.json";
import dealsTranslations from "./i18n_deals.json";
import type { LangCode } from "./index";

type ToolEntry = Partial<Record<Exclude<LangCode, "en">, { description?: string; key_features?: string }>>;
const map = toolTranslations as Record<string, ToolEntry>;

// Flat string-keyed dictionary: { "20% OFF": { en, uk, ja, ... } }
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

// Strict shape: { "<ToolName>": { "<lang>": { description, features, badge, pricing } } }
type LocaleFields = {
  description?: string;
  feats?: string;
  features?: string;
  badge?: string;
  price?: string;
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

function fieldKeys(field: ToolField): (keyof LocaleFields)[] {
  if (field === "key_features") return ["features", "feats"];
  if (field === "pricing") return ["pricing", "price"];
  return [field];
}

function pickFromEntry(entry: DealEntry | undefined, locale: LangCode, field: ToolField): string | undefined {
  const fields = entry?.[locale];
  if (!fields) return undefined;
  for (const k of fieldKeys(field)) {
    const v = fields[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return undefined;
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
