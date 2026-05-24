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
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">Affiliate Disclosure</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {today}</p>

        <section className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
          <p className="italic">
            We participate in various affiliate and partner programs. We may earn
            a commission when you purchase through our links at no extra cost to
            you. These commissions help us keep the site running and verify deals
            daily — but a tool's affiliate status never determines whether we
            list it or how we describe its discount.
          </p>
          <p>
            If you have questions about a specific partnership or want to flag a
            deal, reach us at{" "}
            <a href="mailto:hello@getaidiscounts.com" className="text-electric hover:underline">
              hello@getaidiscounts.com
            </a>
            .
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
