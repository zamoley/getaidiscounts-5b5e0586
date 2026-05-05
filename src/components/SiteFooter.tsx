import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useLocale, localizedPath } from "@/i18n/use-locale";

export function SiteFooter({ showDisclosure = true }: { showDisclosure?: boolean }) {
  const { t } = useTranslation();
  const locale = useLocale();
  return (
    <footer className="mx-auto max-w-7xl border-t border-border/60 px-6 py-10 text-sm text-muted-foreground">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
        <div className="text-center md:text-left">
          © {new Date().getFullYear()} GetAIDiscounts.com — {t("footer.rights")}
        </div>
        <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span className="font-semibold uppercase tracking-wider text-foreground/70">{t("footer.legal")}</span>
          <Link to={localizedPath(locale, "/privacy")} className="hover:text-electric">{t("footer.privacy")}</Link>
          <Link to={localizedPath(locale, "/terms")} className="hover:text-electric">{t("footer.terms")}</Link>
          <Link to={localizedPath(locale, "/affiliate-disclosure")} className="hover:text-electric">{t("footer.affiliate")}</Link>
        </nav>
      </div>
      {showDisclosure && (
        <p className="mt-6 text-center text-xs italic text-muted-foreground/80">
          {t("footer.disclosure")}
        </p>
      )}
    </footer>
  );
}
