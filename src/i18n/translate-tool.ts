import toolTranslations from "./tool-translations.json";
import dealsTranslations from "./i18n_deals.json";
import type { LangCode } from "./index";

type ToolEntry = Partial<Record<Exclude<LangCode, "en">, { description?: string; key_features?: string }>>;
const map = toolTranslations as Record<string, ToolEntry>;

type DealLangEntry = {
  description?: string;
  features?: string | string[] | Record<string, unknown>;
  badge?: string;
  pricing?: string;
};
type DealEntry = Partial<Record<LangCode, DealLangEntry>>;
export const translations = dealsTranslations as unknown as Record<string, DealEntry>;

const dealsLowerMap: Record<string, DealEntry> = Object.fromEntries(
  Object.entries(translations).map(([k, v]) => [k.toLowerCase().trim(), v])
);

function lookupDeal(toolName: string, locale: LangCode): DealLangEntry | undefined {
  const direct = translations[toolName];
  if (direct?.[locale]) return direct[locale];
  const lower = dealsLowerMap[toolName.toLowerCase().trim()];
  return lower?.[locale];
}

const toStr = (v: unknown): string | undefined => {
  if (v == null) return undefined;
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.filter(Boolean).map((x) => toStr(x) ?? "").join(", ");
  if (typeof v === "object") {
    return Object.entries(v as Record<string, unknown>)
      .map(([k, val]) => {
        const label = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        return `${label}: ${toStr(val) ?? ""}`;
      })
      .join(" • ");
  }
  return String(v);
};

export type ToolField = "description" | "key_features" | "badge" | "pricing";

export function translateTool(
  toolName: string,
  locale: LangCode,
  field: ToolField,
  fallback?: string
): string | undefined {
  const dealField: keyof DealLangEntry =
    field === "description" ? "description"
    : field === "key_features" ? "features"
    : field === "badge" ? "badge"
    : "pricing";

  const dealEntry = lookupDeal(toolName, locale);
  const localized = toStr(dealEntry?.[dealField]);
  if (localized) return localized;

  const enEntry = lookupDeal(toolName, "en");
  const enVal = toStr(enEntry?.[dealField]);
  if (enVal) return enVal;

  if (locale !== "en" && (field === "description" || field === "key_features")) {
    const entry = map[toolName];
    const legacy = entry?.[locale as Exclude<LangCode, "en">]?.[field];
    if (legacy) return legacy;
  }
  return fallback;
}
