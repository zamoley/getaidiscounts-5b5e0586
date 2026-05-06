import i18n from "@/i18n";

/**
 * Translate a raw category string from the data feed using the
 * `categories.<Raw String>` key. Falls back to the raw string if no
 * translation exists so newly-harvested categories never appear empty.
 */
export function translateCategory(raw: string): string {
  if (!raw) return raw;
  const key = `categories.${raw}`;
  const translated = i18n.t(key);
  return translated === key ? raw : translated;
}
