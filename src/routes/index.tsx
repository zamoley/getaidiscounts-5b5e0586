import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Sparkles, Zap } from "lucide-react";
import { fetchDeals, type Deal } from "@/lib/deals";
import { DealCard } from "@/components/DealCard";
import { CompareDrawer } from "@/components/CompareDrawer";
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
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-electric to-electric-glow">
              <Zap className="h-4 w-4 text-electric-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Get<span className="text-electric">AI</span>Discounts
            </span>
          </a>
          <Badge className="hidden border border-electric/30 bg-electric/10 text-electric sm:inline-flex">
            <Sparkles className="mr-1 h-3 w-3" /> {deals.length} deals live
          </Badge>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 text-center">
          <Badge className="mb-5 border border-electric/30 bg-electric/10 text-electric">
            Verified daily · Updated {new Date().toLocaleDateString()}
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
        <div className="flex flex-wrap gap-2">
          <CategoryChip active={category === null} onClick={() => setCategory(null)}>All</CategoryChip>
          {categories.map(c => (
            <CategoryChip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</CategoryChip>
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

      <footer className="mx-auto max-w-7xl border-t border-border/60 px-6 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GetAIDiscounts.com — Some links are monetized via Skimlinks.
      </footer>

      {compare.ids.length > 0 && (
        <CompareDrawer deals={compared} onRemove={compare.remove} onClear={compare.clear} />
      )}
    </main>
  );
}

function CategoryChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
        active
          ? "border-electric bg-electric text-electric-foreground"
          : "border-border bg-card text-muted-foreground hover:border-electric/50 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
