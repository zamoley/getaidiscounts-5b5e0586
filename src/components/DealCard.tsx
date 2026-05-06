import { useState } from "react";
import { Copy, Check, Plus, X, ExternalLink, BadgeCheck, Radio } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Deal } from "@/lib/deals";
import { smartLink } from "@/lib/smartlink";
import { VoteButtons } from "@/components/VoteButtons";
import { ToolLogo } from "@/components/ToolLogo";
import { useLocale } from "@/i18n/use-locale";
import { translateTool } from "@/i18n/translate-tool";
import { categoryStyle } from "@/lib/category-style";
import { useCategoryLabel } from "@/i18n/use-category-label";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function isToday(iso: string) {
  const d = new Date(iso);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
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
  const { t } = useTranslation();
  const tCat = useCategoryLabel();
  const locale = useLocale();
  const localizedDesc = translateTool(deal.tool, locale, "description", deal.description);

  const copy = async () => {
    if (!deal.code) return;
    try {
      await navigator.clipboard.writeText(deal.code);
      setCopied(true);
      toast.success("Code Copied!", { description: deal.code });
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const handleGetDeal = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (deal.code) {
      try {
        await navigator.clipboard.writeText(deal.code);
        toast.success("Code Copied!", { description: deal.code });
      } catch {}
    }
    window.location.href = smartLink(deal.url);
  };

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:border-electric/60 hover:-translate-y-0.5 hover:shadow-[var(--shadow-electric)]">
      <button
        onClick={onToggleCompare}
        aria-label={inCompare ? t("card.remove_compare") : t("card.add_compare")}
        className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
          inCompare
            ? "border-electric bg-electric text-electric-foreground"
            : "border-border bg-secondary/60 text-muted-foreground hover:border-electric/60 hover:text-electric"
        }`}
      >
        {inCompare ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>

      <div className="flex items-start gap-3 pr-10">
        <ToolLogo tool={deal.tool} url={deal.url} category={deal.category} size={44} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground">{deal.tool}</h3>
          {deal.category && (() => {
            const { Icon, color } = categoryStyle(deal.category);
            return (
              <p className={`mt-0.5 flex items-center gap-1.5 truncate text-xs font-medium tracking-wide ${color}`}>
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{deal.category}</span>
              </p>
            );
          })()}
        </div>
      </div>

      {localizedDesc && (
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground [hyphens:auto] [overflow-wrap:anywhere]">{localizedDesc}</p>
      )}

      <div className="mt-4">
        <Badge className="border-0 bg-gradient-to-r from-electric to-electric-glow px-3 py-1 text-sm font-bold text-electric-foreground shadow-[0_0_20px_-5px_var(--electric)]">
          {deal.discount}
        </Badge>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          onClick={copy}
          className="min-w-0 flex-1 basis-[10rem] justify-between border border-border bg-secondary/60 px-3 font-mono text-xs hover:bg-secondary"
          disabled={!deal.code}
        >
          <span className="truncate">{deal.code ?? t("card.no_code")}</span>
          {copied ? <Check className="h-4 w-4 text-electric shrink-0" /> : <Copy className="h-4 w-4 shrink-0" />}
        </Button>
        <Button
          onClick={handleGetDeal}
          className="w-full basis-full px-4 bg-electric text-electric-foreground hover:bg-electric-glow sm:w-auto sm:basis-auto sm:flex-none"
        >
          <span className="truncate">{t("card.get_deal")}</span>
          <ExternalLink className="ml-1.5 h-3.5 w-3.5 shrink-0" />
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        {isToday(deal.lastVerified) ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-400">
            <BadgeCheck className="h-3.5 w-3.5" /> {t("card.verified_today")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/40 px-2 py-0.5 text-muted-foreground">
            <BadgeCheck className="h-3.5 w-3.5 text-electric" />
            {t("card.verified")} <span className="text-foreground/80">{formatDate(deal.lastVerified)}</span>
          </span>
        )}
        {deal.source && (
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/40 px-2 py-0.5 text-muted-foreground">
            <Radio className="h-3 w-3 text-electric" />
            {t("card.sourced_via")} <span className="text-foreground/80">{deal.source}</span>
          </span>
        )}
      </div>

      <VoteButtons dealId={deal.id} />
    </article>
  );
}
