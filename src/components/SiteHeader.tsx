import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { OwlLogo } from "@/components/OwlLogo";
import { RequestDealButton } from "@/components/RequestDealButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale, localizedTo } from "@/i18n/use-locale";

const NAV_CATEGORIES: { slug: string; label: string; featured?: boolean; icon?: LucideIcon }[] = [
  { slug: "video", label: "Video AI" },
  { slug: "voice", label: "Voice AI" },
  { slug: "writing", label: "Writing AI" },
  { slug: "agents", label: "AI Agents" },
  { slug: "code", label: "Code AI" },
  { slug: "music", label: "Music AI", featured: true, icon: Sparkles },
  { slug: "groupbuy", label: "Group-Buy", featured: true, icon: Users },
];

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

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {NAV_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={localizedTo(locale, `/${c.slug}`)}
              className={
                c.featured
                  ? "inline-flex items-center gap-1 rounded-full border border-electric/50 bg-electric/10 px-3 py-1.5 font-semibold text-electric shadow-[0_0_18px_-6px_var(--electric)] hover:bg-electric/20"
                  : "rounded-full px-3 py-1.5 text-foreground/80 hover:text-electric hover:bg-card"
              }
            >
              {c.featured && <Sparkles className="h-3.5 w-3.5" aria-hidden />}
              {c.label}
              {c.featured && <span className="ml-1 rounded-full bg-electric/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">New</span>}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <RequestDealButton />
        </div>
      </div>
    </header>
  );
}
