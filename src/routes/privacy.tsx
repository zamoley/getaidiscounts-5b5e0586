import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | GetAIDiscounts" },
      { name: "description", content: "How GetAIDiscounts collects, uses, and protects your data, including email collection and affiliate tracking." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-14 prose prose-invert">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="text-muted-foreground">
            GetAIDiscounts ("we", "us") respects your privacy. This page explains what we collect,
            why we collect it, and the choices you have.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Email Collection</h2>
          <p className="text-muted-foreground">
            When you subscribe to our newsletter, we collect your email address solely to send you
            verified AI tool deals, promo codes, and occasional product updates. We never sell or
            rent your email to third parties. You can unsubscribe at any time using the link in
            every email; once you unsubscribe, your email is removed from our active mailing list.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Affiliate Tracking</h2>
          <p className="text-muted-foreground">
            Many outbound links on this site are monetized through affiliate networks such as
            Skimlinks. When you click a deal and complete a purchase, we may receive a small
            commission at no additional cost to you. These networks may set cookies to attribute
            your purchase to our site. We do not receive your payment details — only aggregated
            referral and commission data from the networks.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Cookies & Analytics</h2>
          <p className="text-muted-foreground">
            We use a minimal set of cookies for site functionality, affiliate attribution, and
            anonymous analytics. You can clear or block cookies via your browser at any time.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">
            Questions about this policy? Reach us at hello@getaidiscounts.com.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
