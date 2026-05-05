import { X } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Deal } from "@/lib/deals";

export function CompareDrawer({
  deals, onRemove, onClear,
}: { deals: Deal[]; onRemove: (id: string) => void; onClear: () => void }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-40 h-14 rounded-full border border-electric/40 bg-card px-6 text-foreground shadow-[var(--shadow-electric)] hover:bg-card"
        >
          Compare
          <Badge className="ml-2 border-0 bg-electric text-electric-foreground">{deals.length}</Badge>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full border-border bg-card sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-foreground">Compare AI Deals</SheetTitle>
        </SheetHeader>

        {deals.length === 0 ? (
          <div className="mt-12 text-center text-muted-foreground">
            Tap the <span className="text-electric">+</span> on any card to start comparing.
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {deals.map(d => (
              <div key={d.id} className="flex items-center justify-between rounded-xl border border-border bg-background/40 p-4">
                <div className="min-w-0">
                  <div className="font-semibold text-foreground">{d.tool}</div>
                  <div className="text-xs text-muted-foreground">{d.category} · code <span className="font-mono text-foreground/80">{d.code ?? "—"}</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="border-0 bg-gradient-to-r from-electric to-electric-glow text-electric-foreground">{d.discount}</Badge>
                  <button onClick={() => onRemove(d.id)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deals.length > 0 && (
          <SheetFooter className="mt-6">
            <Button variant="secondary" onClick={onClear} className="w-full">Clear all</Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
