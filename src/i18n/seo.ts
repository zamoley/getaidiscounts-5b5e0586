import { SUPPORTED_LANGUAGES } from "./index";

const SITE = "https://getaidiscounts.com";

/** Build hreflang alternate <link> entries for a given path (no locale prefix, e.g. "/agents"). */
export function hreflangLinks(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const tail = clean === "/" ? "" : clean;
  return [
    ...SUPPORTED_LANGUAGES.map(l => ({
      rel: "alternate",
      hrefLang: l.code,
      href: l.code === "en" ? `${SITE}${clean}` : `${SITE}/${l.code}${tail}`,
    })),
    { rel: "alternate", hrefLang: "x-default" as never, href: `${SITE}${clean}` },
  ];
}

/** Resolve the canonical URL for the current locale + path. */
export function canonicalFor(locale: string, path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const tail = clean === "/" ? "" : clean;
  return locale === "en" ? `${SITE}${clean}` : `${SITE}/${locale}${tail}`;
}
