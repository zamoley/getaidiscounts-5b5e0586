import { useState } from "react";
import { Copy, Check, Plus, X, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Deal } from "@/lib/deals";
import { smartLink } from "@/lib/smartlink";
import { VoteButtons } from "@/components/VoteButtons";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function DealCard({
  deal,
  inCompare,
  onToggleCompare,
}: {
  deal: Deal;
  inCompare: boolean;
  onToggleCompare: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!deal.code) return;
    try {
      await navigator.clipboard.writeText(deal.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const handleGetDeal = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (deal.code) {
      try {
        await navigator.clipboard.writeText(deal.code);
      } catch {}
    }
    window.location.href = smartLink(deal.url);
  };

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:border-electric/60 hover:-translate-y-0.5 hover:shadow-[var(--shadow-electric)]">
      <button
        onClick={onToggleCompare}
        aria-label={inCompare ? "Remove from compare" : "Add to compare"}
        className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
          inCompare
            ? "border-electric bg-electric text-electric-foreground"
            : "border-border bg-secondary/60 text-muted-foreground hover:border-electric/60 hover:text-electric"
        }`}
      >
        {inCompare ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>

      <div className="flex items-start gap-3 pr-10">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-electric/30 to-electric/5 text-electric font-bold">
          {deal.tool.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">{deal.tool}</h3>
          {deal.category && (
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{deal.category}</p>
          )}
        </div>
      </div>

      {deal.description && (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{deal.description}</p>
      )}

      <div className="mt-4">
        <Badge className="border-0 bg-gradient-to-r from-electric to-electric-glow px-3 py-1 text-sm font-bold text-electric-foreground shadow-[0_0_20px_-5px_var(--electric)]">
          {deal.discount}
        </Badge>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={copy}
          className="flex-1 justify-between border border-border bg-secondary/60 font-mono text-xs hover:bg-secondary"
          disabled={!deal.code}
        >
          <span className="truncate">{deal.code ?? "NO CODE"}</span>
          {copied ? <Check className="h-4 w-4 text-electric" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button
          onClick={handleGetDeal}
          className="bg-electric text-electric-foreground hover:bg-electric-glow"
        >
          Get Deal <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-electric" />
        Last verified <span className="text-foreground/80">{formatDate(deal.lastVerified)}</span>
      </div>

      <VoteButtons dealId={deal.id} />
    </article>
  );
}
