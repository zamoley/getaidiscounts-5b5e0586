import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/affiliate-disclosure")({
  head: () => ({
    meta: [
      { title: "Affiliate Disclosure | GetAIDiscounts" },
      { name: "description", content: "How GetAIDiscounts earns commissions through affiliate links." },
    ],
  }),
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
          <p className="text-muted-foreground">
            GetAIDiscounts participates in affiliate programs, including Skimlinks and direct
            partnerships with AI tool providers. When you click a link on our site and make a
            purchase, we may receive a commission — at no additional cost to you.
          </p>
          <p className="text-muted-foreground">
            These commissions help us keep the site running, verify deals daily, and add new
            tools. Our editorial choices are independent: a tool's affiliate status never
            influences whether we list it or how we describe its discount.
          </p>
          <p className="text-muted-foreground italic">
            Disclosure: We may earn a commission when you click our links at no extra cost to you.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
