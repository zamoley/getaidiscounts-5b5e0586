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
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">Affiliate Disclosure</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mt-8 space-y-3">
          <p className="text-muted-foreground italic">
            Disclosure: GetAIDiscounts.com is an independent directory supported by our audience. When you purchase through links on our site, we may earn an affiliate commission at no extra cost to you. Our editorial choices are independent and not influenced by our affiliate status.
          </p>
          <p className="text-muted-foreground">
            We participate in affiliate programs including Skimlinks and direct partnerships with
            AI tool providers. These commissions help us keep the site running, verify deals
            daily, and add new tools — but a tool's affiliate status never determines whether we
            list it or how we describe its discount.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
