import { useParams, type NavigateOptions } from "@tanstack/react-router";
import { useEffect } from "react";
import i18n, { SUPPORTED_CODES, type LangCode } from "@/i18n";

export function isLang(v: string | undefined): v is LangCode {
  return !!v && (SUPPORTED_CODES as readonly string[]).includes(v);
}

export function useLocale(): LangCode {
  const params = useParams({ strict: false }) as { locale?: string };
  const locale = isLang(params.locale) ? params.locale : "en";
  useEffect(() => {
    if (i18n.language !== locale) i18n.changeLanguage(locale);
  }, [locale]);
  return locale;
}

/** Build a path with the locale prefix (en omits prefix). */
export function localizedPath(locale: LangCode, path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean;
  return `/${locale}${clean === "/" ? "" : clean}`;
}

export function localizedTo(locale: LangCode, path: string) {
  return localizedPath(locale, path) as NavigateOptions["to"];
}
