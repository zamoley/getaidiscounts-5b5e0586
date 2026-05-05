import toolTranslations from "./tool-translations.json";
import type { LangCode } from "./index";

type ToolEntry = Partial<Record<Exclude<LangCode, "en">, { description?: string; key_features?: string }>>;
const map = toolTranslations as Record<string, ToolEntry>;

export function translateTool(toolName: string, locale: LangCode, field: "description" | "key_features", fallback?: string): string | undefined {
  if (locale === "en") return fallback;
  const entry = map[toolName];
  return entry?.[locale]?.[field] ?? fallback;
}
