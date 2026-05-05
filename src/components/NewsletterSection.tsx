import { useState } from "react";
import { z } from "zod";
import { Mail, Sparkles, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
});

export function NewsletterSection({ source = "home" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setState("loading");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.email.toLowerCase(), source });

    if (error && !/duplicate|unique/i.test(error.message)) {
      setState("idle");
      toast.error("Couldn't subscribe. Try again.");
      return;
    }
    setState("done");
    toast.success("You're in! Watch your inbox for fresh AI deals.");
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-br from-card via-card to-card p-10 shadow-[var(--shadow-electric)] sm:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at top right, oklch(0.72 0.21 245 / 0.25), transparent 60%)" }}
        />
        <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-3 py-1 text-xs font-medium text-electric">
              <Sparkles className="h-3 w-3" /> Free · Weekly
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Get <span className="bg-gradient-to-r from-electric to-electric-glow bg-clip-text text-transparent">AI Deal Alerts</span>
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              The freshest AI tool discounts, hand-picked and delivered to your inbox every Friday. No spam.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@startup.com"
                required
                disabled={state !== "idle"}
                className="h-12 border-border bg-background/60 pl-11 focus-visible:ring-electric"
              />
            </div>
            <Button
              type="submit"
              disabled={state !== "idle"}
              className="h-12 bg-electric px-6 text-electric-foreground hover:bg-electric-glow"
            >
              {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> :
                state === "done" ? <><Check className="mr-2 h-4 w-4" /> Subscribed</> :
                "Get Deal Alerts"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
