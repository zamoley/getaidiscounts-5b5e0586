import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { OwlLogo } from "@/components/OwlLogo";
import { RequestDealButton } from "@/components/RequestDealButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale, localizedTo } from "@/i18n/use-locale";

export function SiteHeader() {
  const locale = useLocale();
  useTranslation();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <Link to={localizedTo(locale, "/")} className="flex items-center gap-2.5 shrink-0 leading-none">
          <OwlLogo className="h-9 w-9 text-electric drop-shadow-[0_0_10px_oklch(0.72_0.21_245/0.55)]" />
          <span className="text-lg font-bold tracking-tight leading-none">
            Get<span className="text-electric">AI</span>Discounts
          </span>
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <RequestDealButton />
        </div>
      </div>
    </header>
  );
}
