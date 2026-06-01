import { useState } from "react";
import { z } from "zod";
import { Mail, Sparkles, Loader2, Check } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLocale, localizedTo } from "@/i18n/use-locale";
import { gaEvent } from "@/lib/analytics";

const schema = z.object({
  email: z.string().trim().email().max(255),
});

export function NewsletterSection({ source = "home" }: { source?: string }) {
  const { t } = useTranslation();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(t("newsletter.error"));
      return;
    }
    setState("loading");
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.email.toLowerCase(), source });

    if (error && !/duplicate|unique/i.test(error.message)) {
      setState("idle");
      toast.error(t("newsletter.error"));
      return;
    }
    setState("done");
    gaEvent("newsletter_signup", { source });
    toast.success(t("newsletter.success"));
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
              <Sparkles className="h-3 w-3" /> {t("newsletter.badge")}
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl [overflow-wrap:anywhere]">
              {t("newsletter.title_pre")}{" "}
              <span className="bg-gradient-to-r from-electric to-electric-glow bg-clip-text text-transparent">
                {t("newsletter.title_highlight")}
              </span>
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">{t("newsletter.subtitle")}</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["from-electric to-electric-glow", "from-emerald-400 to-emerald-600", "from-fuchsia-400 to-fuchsia-600", "from-amber-400 to-amber-600"].map((g, i) => (
                  <div key={i} className={`h-7 w-7 rounded-full border-2 border-card bg-gradient-to-br ${g}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{t("newsletter.joined")}</span> {t("newsletter.joined_post")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t("newsletter.placeholder")}
                  required
                  disabled={state !== "idle"}
                  className="h-12 border-border bg-background/60 pl-11 focus-visible:ring-electric"
                />
              </div>
              <Button
                type="submit"
                disabled={state !== "idle"}
                aria-label={state === "loading" ? "Subscribing" : state === "done" ? t("newsletter.button_done") : t("newsletter.button_idle")}
                className="h-12 bg-electric px-6 text-electric-foreground hover:bg-electric-glow"
              >
                {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> :
                  state === "done" ? <><Check className="mr-2 h-4 w-4" /> {t("newsletter.button_done")}</> :
                  t("newsletter.button_idle")}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              <Trans
                i18nKey="newsletter.privacy_note"
                components={[
                  <Link
                    key="privacy"
                    to={localizedTo(locale, "/privacy")}
                    className="text-electric underline-offset-4 hover:underline"
                  />,
                ]}
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
