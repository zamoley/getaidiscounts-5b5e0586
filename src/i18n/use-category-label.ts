import { useTranslation } from "react-i18next";

/**
 * Returns a translator for raw category labels coming from the data feed.
 * Looks up `categories.<Raw String>` and falls back to the raw value when
 * no translation exists, so freshly-harvested categories never render empty.
 */
export function useCategoryLabel() {
  const { t, i18n } = useTranslation();
  return (raw: string | undefined | null): string => {
    if (!raw) return "";
    const key = `categories.${raw}`;
    if (i18n.exists(key)) return t(key);
    return raw;
  };
}
