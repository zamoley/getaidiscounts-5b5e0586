import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchDeals, type Deal } from "@/lib/deals";
import { DealCard } from "@/components/DealCard";
import { CompareBar } from "@/components/CompareBar";
import { NewsletterSection } from "@/components/NewsletterSection";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCompare, getCompared } from "@/hooks/use-compare";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/i18n/use-locale";
import { SUPPORTED_LANGUAGES } from "@/i18n";

const SITE = "https://getaidiscounts.com";

export const Route = createFileRoute("/{-$locale}/")({
  loader: () => fetchDeals(),
  head: ({ params }) => {
    const loc = (params as { locale?: string }).locale ?? "en";
    return {
      links: [
        ...SUPPORTED_LANGUAGES.map(l => ({
          rel: "alternate",
          hrefLang: l.code,
          href: l.code === "en" ? `${SITE}/` : `${SITE}/${l.code}/`,
        })),
        { rel: "alternate", hrefLang: "x-default" as never, href: `${SITE}/` },
      ],
      meta: [
        { property: "og:locale", content: loc },
      ],
    };
  },
  component: Index,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-muted-foreground">Failed to load deals: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Not found</div>,
});

function Index() {
  const deals = Route.useLoaderData() as Deal[];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const compare = useCompare();
  const { t } = useTranslation();
  useLocale();

  const categories = useMemo(
    () => Array.from(new Set(deals.map(d => d.category).filter(Boolean))) as string[],
    [deals]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deals.filter(d => {
      if (category && d.category !== category) return false;
      if (!q) return true;
      return (
        d.tool.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.code?.toLowerCase().includes(q)
      );
    });
  }, [deals, query, category]);

  const compared = getCompared(deals, compare.ids);

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 text-center">
          <Badge className="mb-5 border border-electric/30 bg-electric/10 text-electric">
            <Sparkles className="mr-1 h-3 w-3" /> {t("hero.badge", { count: deals.length, date: new Date().toLocaleDateString() })}
          </Badge>
          <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            {t("hero.title_pre")}{" "}
            <span className="bg-gradient-to-r from-electric to-electric-glow bg-clip-text text-transparent">
              {t("hero.title_highlight")}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground">
            {t("hero.subtitle")}
          </p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("hero.search_placeholder")}
              className="h-12 rounded-full border-border bg-card pl-11 text-base shadow-[var(--shadow-card)] focus-visible:ring-electric"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-stretch justify-center gap-2.5">
          <CategoryChip active={category === null} onClick={() => setCategory(null)} emoji="✨" label={t("categories.all")} />
          {categories.map(c => (
            <CategoryChip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              emoji={emojiForCategory(c)}
              label={c}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
            {t("empty.no_results")}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(d => (
              <DealCard
                key={d.id}
                deal={d}
                inCompare={compare.has(d.id)}
                onToggleCompare={() => compare.toggle(d.id)}
              />
            ))}
          </div>
        )}
      </section>

      <NewsletterSection source="home" />

      <SiteFooter showDisclosure />

      {compare.ids.length > 0 && (
        <CompareBar deals={compared} onRemove={compare.remove} onClear={compare.clear} />
      )}
    </main>
  );
}

function emojiForCategory(c: string): string {
  const k = c.toLowerCase();
  if (k.includes("image")) return "🎨";
  if (k.includes("video")) return "🎬";
  if (k.includes("voice") || k.includes("audio")) return "🎙️";
  if (k.includes("music")) return "🎵";
  if (k.includes("writ")) return "✍️";
  if (k.includes("chat")) return "💬";
  if (k.includes("code") || k.includes("dev") || k.includes("no-code")) return "💻";
  if (k.includes("agent")) return "🤖";
  if (k.includes("search")) return "🔎";
  if (k.includes("product")) return "📊";
  return "⚡";
}

function CategoryChip({
  active, onClick, emoji, label,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? "border-electric bg-electric/15 text-electric ring-2 ring-electric/60 shadow-[0_0_28px_-4px_var(--electric)]"
          : "border-border bg-card/70 text-foreground/80 hover:border-electric/40 hover:text-foreground hover:bg-card"
      }`}
    >
      <span className="text-base leading-none" aria-hidden>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
