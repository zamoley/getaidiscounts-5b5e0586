import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useLocale, localizedTo } from "@/i18n/use-locale";

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
          <Link to={localizedTo(locale, "/privacy")} className="hover:text-electric">{t("footer.privacy")}</Link>
          <Link to={localizedTo(locale, "/terms")} className="hover:text-electric">{t("footer.terms")}</Link>
          <Link to={localizedTo(locale, "/affiliate-disclosure")} className="hover:text-electric">{t("footer.affiliate")}</Link>
        </nav>
      </div>
      {showDisclosure && (
        <p className="mt-6 text-center text-xs italic text-muted-foreground/80">
          {t("footer.disclosure")}
        </p>
      )}
      <div className="mt-8 border-t border-border/40 pt-5 text-center text-xs text-muted-foreground/70">
        Built with{" "}
        <a
          href="https://lovable.dev/invite/2V95H5P"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground/80 transition-colors hover:text-electric"
        >
          Lovable
        </a>
        {" & "}
        <a
          href="https://www.accio.com/invite-work?sId=XuPH1%2B7aCzT74ndJlp0ipA%3D%3D&ic=IC025014249995&tenant=accio&src=p_referral_IC025014249995&return_url=https%3A%2F%2Fwww.accio.com%2Fwork%2F"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground/80 transition-colors hover:text-electric"
        >
          Accio Work
        </a>
      </div>
    </footer>
  );
}
