import { useMemo, useState } from "react";
import { ShieldCheck, Search } from "lucide-react";
import { DealCard } from "@/components/DealCard";
import { CompareBar } from "@/components/CompareBar";
import { NewsletterSection } from "@/components/NewsletterSection";
import { SiteHeader } from "@/components/SiteHeader";
import { useCompare, getCompared } from "@/hooks/use-compare";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Deal } from "@/lib/deals";

export type CategoryConfig = {
  slug: string;
  label: string;
  h1: string;
  intro: string;
  /** category values from the data feed that belong to this page */
  matches: string[];
  /** keyword fallback when category metadata is missing */
  keywords?: string[];
};

export function CategoryPage({
  deals,
  config,
}: { deals: Deal[]; config: CategoryConfig }) {
  const [query, setQuery] = useState("");
  const compare = useCompare();

  const matches = useMemo(() => {
    const cats = config.matches.map(c => c.toLowerCase());
    const kws = (config.keywords ?? []).map(k => k.toLowerCase());
    return deals.filter(d => {
      const cat = (d.category ?? "").toLowerCase();
      if (cats.includes(cat)) return true;
      const hay = `${d.tool} ${d.description ?? ""}`.toLowerCase();
      return kws.some(k => hay.includes(k));
    });
  }, [deals, config]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return matches;
    return matches.filter(d =>
      d.tool.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.code?.toLowerCase().includes(q)
    );
  }, [matches, query]);

  const today = new Date().toLocaleDateString(undefined, {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 pt-14 pb-8 text-center">
        <Badge className="mb-5 border border-electric/40 bg-electric/10 text-electric">
          <ShieldCheck className="mr-1 h-3 w-3" /> Verified {today} · {matches.length} deals
        </Badge>
        <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold tracking-tight sm:text-6xl">
          {config.h1.split(config.label).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="bg-gradient-to-r from-electric to-electric-glow bg-clip-text text-transparent">
                  {config.label}
                </span>
              )}
            </span>
          ))}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-muted-foreground">{config.intro}</p>

        <div className="relative mx-auto mt-8 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${config.label.toLowerCase()} tools…`}
            className="h-12 rounded-full border-border bg-card pl-11 text-base shadow-[var(--shadow-card)] focus-visible:ring-electric"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
            No {config.label.toLowerCase()} deals available right now. Check back soon.
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

      <NewsletterSection source={`category:${config.slug}`} />

      <footer className="mx-auto max-w-7xl border-t border-border/60 px-6 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GetAIDiscounts.com — Some links are monetized via Skimlinks.
      </footer>

      {compare.ids.length > 0 && (
        <CompareBar
          deals={getCompared(deals, compare.ids)}
          onRemove={compare.remove}
          onClear={compare.clear}
        />
      )}
    </main>
  );
}
