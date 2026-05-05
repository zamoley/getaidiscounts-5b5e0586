import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Sparkles, LayoutGrid, Image as ImageIcon, MessageSquare, Video,
  Mic, PenLine, Music, Code2, Bot, Briefcase, Globe, Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { fetchDeals, type Deal } from "@/lib/deals";
import { DealCard } from "@/components/DealCard";
import { CompareBar } from "@/components/CompareBar";
import { NewsletterSection } from "@/components/NewsletterSection";
import { SiteHeader } from "@/components/SiteHeader";
import { useCompare, getCompared } from "@/hooks/use-compare";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  loader: () => fetchDeals(),
  component: Index,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-muted-foreground">Failed to load deals: {error.message}</div>
  ),
});

function Index() {
  const deals = Route.useLoaderData() as Deal[];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const compare = useCompare();

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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 text-center">
          <Badge className="mb-5 border border-electric/30 bg-electric/10 text-electric">
            <Sparkles className="mr-1 h-3 w-3" /> {deals.length} live · Updated {new Date().toLocaleDateString()}
          </Badge>
          <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold tracking-tight sm:text-6xl">
            The premium directory of{" "}
            <span className="bg-gradient-to-r from-electric to-electric-glow bg-clip-text text-transparent">
              AI tool discounts
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground">
            Hand-picked promo codes and exclusive deals on the AI tools you actually use. Copy, save, ship.
          </p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Midjourney, ChatGPT, Cursor…"
              className="h-12 rounded-full border-border bg-card pl-11 text-base shadow-[var(--shadow-card)] focus-visible:ring-electric"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-stretch justify-center gap-2.5">
          <CategoryChip active={category === null} onClick={() => setCategory(null)} icon={LayoutGrid} label="All" />
          {categories.map(c => (
            <CategoryChip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              icon={iconForCategory(c)}
              label={c}
            />
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
            No deals match your search.
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

      <footer className="mx-auto max-w-7xl border-t border-border/60 px-6 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GetAIDiscounts.com — Some links are monetized via Skimlinks.
      </footer>

      {compare.ids.length > 0 && (
        <CompareBar deals={compared} onRemove={compare.remove} onClear={compare.clear} />
      )}
    </main>
  );
}

function iconForCategory(c: string): LucideIcon {
  const k = c.toLowerCase();
  if (k.includes("image")) return ImageIcon;
  if (k.includes("video")) return Video;
  if (k.includes("voice") || k.includes("audio")) return Mic;
  if (k.includes("music")) return Music;
  if (k.includes("writ")) return PenLine;
  if (k.includes("chat")) return MessageSquare;
  if (k.includes("code") || k.includes("dev")) return Code2;
  if (k.includes("agent")) return Bot;
  if (k.includes("search")) return Globe;
  if (k.includes("product")) return Briefcase;
  return Wand2;
}

function CategoryChip({
  active, onClick, icon: Icon, label,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "border-electric bg-electric/15 text-electric ring-1 ring-electric/50 shadow-[0_0_24px_-4px_var(--electric)]"
          : "border-border bg-card/70 text-muted-foreground hover:border-electric/40 hover:text-foreground hover:bg-card"
      }`}
    >
      <Icon className={`h-4 w-4 transition-transform ${active ? "text-electric" : "text-muted-foreground group-hover:text-electric"}`} />
      <span>{label}</span>
    </button>
  );
}
