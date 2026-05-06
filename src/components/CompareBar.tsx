import { useState } from "react";
import { X, GitCompareArrows, ExternalLink, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolLogo } from "@/components/ToolLogo";
import type { Deal } from "@/lib/deals";
import { smartLink } from "@/lib/smartlink";
import { useLocale } from "@/i18n/use-locale";
import { translateTool } from "@/i18n/translate-tool";
import { categoryStyle } from "@/lib/category-style";
import { useCategoryLabel } from "@/i18n/use-category-label";

export function CompareBar({
  deals, onRemove, onClear,
}: { deals: Deal[]; onRemove: (id: string) => void; onClear: () => void }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-electric/30 bg-card/95 backdrop-blur-xl shadow-[0_-10px_40px_-10px_oklch(0.72_0.21_245/0.4)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-3">
          <div className="mr-2 flex items-center gap-2 text-sm font-semibold">
            <GitCompareArrows className="h-4 w-4 text-electric" />
            {t("nav.compare")}
            <Badge className="border-0 bg-electric text-electric-foreground">{deals.length}</Badge>
          </div>

          <div className="flex flex-1 flex-wrap items-center gap-2">
            {deals.map(d => (
              <div key={d.id} className="flex items-center gap-2 rounded-full border border-border bg-background/60 py-1 pl-3 pr-1 text-xs">
                <span className="font-medium">{d.tool}</span>
                <button
                  onClick={() => onRemove(d.id)}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label={`Remove ${d.tool}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClear}>{t("compare.clear")}</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={deals.length < 2}
                  className="bg-electric text-electric-foreground shadow-[0_0_24px_-6px_var(--electric)] hover:bg-electric-glow disabled:opacity-50"
                >
                  {t("compare.compare_now")} {deals.length >= 2 ? `(${deals.length})` : ""}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl border-electric/30 bg-card p-0">
                <DialogHeader className="border-b border-border px-6 py-4">
                  <DialogTitle className="flex items-center gap-2 text-lg">
                    <GitCompareArrows className="h-5 w-5 text-electric" />
                    {t("compare.modal_title")}
                  </DialogTitle>
                </DialogHeader>
                <CompareTable deals={deals} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {/* spacer so floating bar doesn't overlap content */}
      <div aria-hidden className="h-24" />
    </>
  );
}

function CompareTable({ deals }: { deals: Deal[] }) {
  const { t } = useTranslation();
  const locale = useLocale();

  const rows: { label: string; get: (d: Deal) => React.ReactNode }[] = [
    { label: t("compare.row_category"), get: d => {
      if (!d.category) return <span className="text-foreground/60">—</span>;
      const { Icon, color } = categoryStyle(d.category);
      return (
        <span className={`inline-flex items-center gap-1.5 ${color}`}>
          <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{d.category}</span>
        </span>
      );
    } },
    { label: t("compare.row_pricing"), get: d => <span className="font-medium text-foreground">{d.pricing ?? "—"}</span> },
    { label: t("compare.row_specs"), get: d => {
      const localized = translateTool(d.tool, locale, "key_features", d.specs ?? undefined);
      return <span className="text-foreground/80">{localized ?? "—"}</span>;
    } },
    {
      label: t("compare.row_discount"),
      get: d => (
        <Badge className="border-0 bg-gradient-to-r from-electric to-electric-glow font-bold text-electric-foreground shadow-[0_0_18px_-4px_var(--electric)]">
          {d.discount}
        </Badge>
      ),
    },
    { label: t("compare.row_code"), get: d => (
      <span className="rounded-md border border-border bg-background/60 px-2 py-1 font-mono text-xs text-foreground">
        {d.code ?? "—"}
      </span>
    ) },
    {
      label: t("compare.row_verified"),
      get: d => (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
          <Check className="h-3.5 w-3.5" /> {new Date(d.lastVerified).toLocaleDateString(locale)}
        </span>
      ),
    },
    {
      label: "",
      get: d => (
        <a
          href={smartLink(d.url)}
          rel="sponsored noopener"
          className="inline-flex flex-wrap items-center gap-1 rounded-md bg-electric px-3 py-1.5 text-xs font-semibold text-electric-foreground hover:bg-electric-glow"
        >
          {t("card.get_deal")} <ExternalLink className="h-3 w-3" />
        </a>
      ),
    },
  ];

  return (
    <div className="max-h-[70vh] overflow-auto px-6 pb-6">
      <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
        <thead className="sticky top-0 z-10 bg-card">
          <tr>
            <th className="sticky left-0 z-20 bg-card py-3 pr-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground"></th>
            {deals.map(d => (
              <th
                key={d.id}
                className="border-b border-border px-4 py-3 text-left"
              >
                <div className="flex items-center gap-2">
                  <ToolLogo tool={d.tool} url={d.url} category={d.category} size={32} />
                  <span className="font-semibold text-foreground">{d.tool}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label || `row-${i}`} className="group">
              <td className="sticky left-0 z-10 bg-card border-b border-border/60 py-3 pr-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {row.label}
              </td>
              {deals.map(d => (
                <td
                  key={d.id}
                  className="border-b border-border/60 px-4 py-3 align-middle transition-colors group-hover:bg-electric/[0.04]"
                >
                  {row.get(d)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
