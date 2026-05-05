import { useState } from "react";
import { z } from "zod";
import { Megaphone, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function RequestDealButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    toolName: z.string().trim().min(1, t("request.tool_required")).max(120),
    email: z.string().trim().email(t("request.email_invalid")).max(255).optional().or(z.literal("")),
    notes: z.string().trim().max(1000).optional(),
  });

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
      toast.error(t("request.error"));
      return;
    }
    toast.success(t("request.success"));
    setTool(""); setEmail(""); setNotes("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label={t("request.button")}
          className="bg-electric text-electric-foreground hover:bg-electric-glow px-3 sm:px-4"
        >
          <Megaphone className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t("request.button")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle>{t("request.dialog_title")}</DialogTitle>
          <DialogDescription>{t("request.dialog_desc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tool">{t("request.tool_label")}</Label>
            <Input id="tool" value={tool} onChange={e => setTool(e.target.value)} placeholder={t("request.tool_placeholder")} required maxLength={120} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t("request.email_label")}</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t("request.email_placeholder")} maxLength={255} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">{t("request.notes_label")}</Label>
            <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} maxLength={1000} placeholder={t("request.notes_placeholder")} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-electric text-electric-foreground hover:bg-electric-glow">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("request.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
