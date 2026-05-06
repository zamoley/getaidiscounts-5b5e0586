import toolTranslations from "./tool-translations.json";
import dealsTranslations from "./i18n_deals.json";
import type { LangCode } from "./index";

type ToolEntry = Partial<Record<Exclude<LangCode, "en">, { description?: string; key_features?: string }>>;
const map = toolTranslations as Record<string, ToolEntry>;

type DealLangEntry = { description?: string; features?: string | string[] | Record<string, unknown> };
type DealEntry = Partial<Record<LangCode, DealLangEntry>>;
const dealsMap = dealsTranslations as unknown as Record<string, DealEntry>;

// Lowercased lookup for resilient matching across casings/spaces.
const dealsLowerMap: Record<string, DealEntry> = Object.fromEntries(
  Object.entries(dealsMap).map(([k, v]) => [k.toLowerCase().trim(), v])
);

function lookupDeal(toolName: string, locale: LangCode): DealLangEntry | undefined {
  const direct = dealsMap[toolName];
  if (direct?.[locale]) return direct[locale];
  const lower = dealsLowerMap[toolName.toLowerCase().trim()];
  return lower?.[locale];
}

export function translateTool(
  toolName: string,
  locale: LangCode,
  field: "description" | "key_features",
  fallback?: string
): string | undefined {
  // Primary source: i18n_deals.json (covers all 9 languages incl. English).
  const toStr = (v: string | string[] | Record<string, unknown> | undefined): string | undefined => {
    if (v == null) return undefined;
    if (typeof v === "string") return v;
    if (Array.isArray(v)) return v.filter(Boolean).join(", ");
    if (typeof v === "object") {
      return Object.entries(v)
        .map(([k, val]) => {
          const label = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          return `${label}: ${String(val)}`;
        })
        .join(" • ");
    }
    return String(v);
  };
  const dealEntry = lookupDeal(toolName, locale);
  const localized = toStr(dealEntry?.[dealField]);
  if (localized) return localized;
  const enEntry = lookupDeal(toolName, "en");
  const enVal = toStr(enEntry?.[dealField]);
  if (enVal) return enVal;
  // Legacy fallback to tool-translations.json.
  if (locale !== "en") {
    const entry = map[toolName];
    const legacy = entry?.[locale as Exclude<LangCode, "en">]?.[field];
    if (legacy) return legacy;
  }
  return fallback;
}
