import { useState } from "react";
import { z } from "zod";
import { Megaphone, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  toolName: z.string().trim().min(1, "Tool name required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional(),
});

export function RequestDealButton() {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ toolName: tool, email, notes });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("deal_requests").insert({
      tool_name: parsed.data.toolName,
      email: parsed.data.email ? parsed.data.email.toLowerCase() : null,
      notes: parsed.data.notes || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Couldn't submit. Try again.");
      return;
    }
    toast.success("Request received! We'll hunt down a deal.");
    setTool(""); setEmail(""); setNotes("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Request a Deal"
          className="bg-electric text-electric-foreground hover:bg-electric-glow px-3 sm:px-4"
        >
          <Megaphone className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Request a Deal</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle>Request an AI deal</DialogTitle>
          <DialogDescription>
            Tell us which AI tool you want a discount for. We'll hunt one down and email you when it's live.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tool">Tool name *</Label>
            <Input id="tool" value={tool} onChange={e => setTool(e.target.value)} placeholder="e.g. Suno, Lovable, Pika…" required maxLength={120} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email (optional, for notifications)</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@startup.com" maxLength={255} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} maxLength={1000} placeholder="Anything specific? Plan tier, region…" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-electric text-electric-foreground hover:bg-electric-glow">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
