import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { hreflangLinks, canonicalFor } from "@/i18n/seo";

export const Route = createFileRoute("/{-$locale}/privacy")({
  head: ({ params }) => {
    const loc = (params as { locale?: string }).locale ?? "en";
    return {
    links: [
      ...hreflangLinks("/privacy"),
      { rel: "canonical", href: canonicalFor(loc, "/privacy") },
    ],
    meta: [
      { title: "Privacy Policy | GetAIDiscounts" },
      { name: "description", content: "How GetAIDiscounts.com collects and uses your data, including email collection and affiliate tracking." },
      { property: "og:locale", content: loc },
      { property: "og:url", content: canonicalFor(loc, "/privacy") },
    ],
    };
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useTranslation();
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">{t("privacy.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("privacy.updated", { date: today })}</p>

        {(["collection", "use", "tracking", "rights"] as const).map((k) => (
          <section key={k} className="mt-8 space-y-3">
            <h2 className="text-2xl font-semibold">{t(`privacy.${k}_h`)}</h2>
            <p className="text-muted-foreground">{t(`privacy.${k}_p`)}</p>
          </section>
        ))}
      </article>
      <SiteFooter />
    </main>
  );
}
