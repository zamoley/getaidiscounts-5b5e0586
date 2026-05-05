import { useState } from "react";
import { X, GitCompareArrows } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Deal } from "@/lib/deals";

export function CompareBar({
  deals, onRemove, onClear,
}: { deals: Deal[]; onRemove: (id: string) => void; onClear: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-electric/30 bg-card/95 backdrop-blur-xl shadow-[0_-10px_40px_-10px_oklch(0.72_0.21_245/0.4)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-3">
          <div className="mr-2 flex items-center gap-2 text-sm font-semibold">
            <GitCompareArrows className="h-4 w-4 text-electric" />
            Compare
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

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={deals.length < 2}
                className="bg-electric text-electric-foreground hover:bg-electric-glow disabled:opacity-50"
              >
                Compare {deals.length >= 2 ? `(${deals.length})` : ""}
              </Button>
            </DialogTrigger>
            <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>

            <DialogContent className="max-w-5xl border-border bg-card">
              <DialogHeader>
                <DialogTitle>Side-by-side comparison</DialogTitle>
              </DialogHeader>
              <CompareTable deals={deals} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* spacer so floating bar doesn't overlap content */}
      <div aria-hidden className="h-24" />
    </>
  );
}

function CompareTable({ deals }: { deals: Deal[] }) {
  const rows: { label: string; get: (d: Deal) => React.ReactNode }[] = [
    { label: "Tool", get: d => <span className="font-semibold text-foreground">{d.tool}</span> },
    { label: "Category", get: d => d.category ?? "—" },
    { label: "Pricing", get: d => d.pricing ?? "—" },
    { label: "Specs", get: d => d.specs ?? "—" },
    {
      label: "Discount",
      get: d => (
        <Badge className="border-0 bg-gradient-to-r from-electric to-electric-glow text-electric-foreground">
          {d.discount}
        </Badge>
      ),
    },
    { label: "Code", get: d => <span className="font-mono text-xs">{d.code ?? "—"}</span> },
    {
      label: "Get deal",
      get: d => (
        <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-electric hover:underline">
          Visit →
        </a>
      ),
    },
  ];

  return (
    <div className="-mx-6 overflow-x-auto px-6">
      <table className="w-full min-w-[600px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 bg-card text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"></th>
            {deals.map(d => (
              <th key={d.id} className="border-b border-border px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {d.tool}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.label}>
              <td className="sticky left-0 bg-card border-b border-border py-3 pr-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {row.label}
              </td>
              {deals.map(d => (
                <td key={d.id} className="border-b border-border px-4 py-3 align-top">{row.get(d)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
