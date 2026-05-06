import toolTranslations from "./tool-translations.json";
import dealsTranslations from "./i18n_deals.json";
import type { LangCode } from "./index";

type ToolEntry = Partial<Record<Exclude<LangCode, "en">, { description?: string; key_features?: string }>>;
const map = toolTranslations as Record<string, ToolEntry>;

type DealLangEntry = { description?: string; features?: string | string[] };
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
  const dealField = field === "description" ? "description" : "features";
  const toStr = (v: string | string[] | undefined) => Array.isArray(v) ? v.join(", ") : v;
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
