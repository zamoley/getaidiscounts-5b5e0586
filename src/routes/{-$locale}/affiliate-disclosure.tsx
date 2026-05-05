import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { hreflangLinks, canonicalFor } from "@/i18n/seo";

export const Route = createFileRoute("/{-$locale}/affiliate-disclosure")({
  head: ({ params }) => {
    const loc = (params as { locale?: string }).locale ?? "en";
    return {
    links: [
      ...hreflangLinks("/affiliate-disclosure"),
      { rel: "canonical", href: canonicalFor(loc, "/affiliate-disclosure") },
    ],
    meta: [
      { title: "Affiliate Disclosure | GetAIDiscounts" },
      { name: "description", content: "How GetAIDiscounts earns commissions through affiliate links." },
      { property: "og:locale", content: loc },
      { property: "og:url", content: canonicalFor(loc, "/affiliate-disclosure") },
    ],
    };
  },
  component: DisclosurePage,
});

function DisclosurePage() {
  const { t } = useTranslation();
  const today = new Date().toLocaleDateString();
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">{t("disclosure.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("disclosure.updated", { date: today })}</p>

        <section className="mt-8 space-y-3">
          <p className="text-muted-foreground italic">{t("disclosure.intro")}</p>
          <p className="text-muted-foreground">{t("disclosure.details")}</p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
