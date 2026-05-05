import { createFileRoute } from "@tanstack/react-router";
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
    ,
      { property: "og:locale", content: loc },
      { property: "og:url", content: canonicalFor(loc, "/privacy") },
    ],
    };
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy for GetAIDiscounts.com</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last Updated: {today}</p>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Data Collection</h2>
          <p className="text-muted-foreground">
            We collect your email address only when you voluntarily sign up for our "AI Deal Alerts." We also use cookies via our affiliate partners (Skimlinks and Impact) to track referrals.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Use of Data</h2>
          <p className="text-muted-foreground">
            Your email is used solely to send you AI discount alerts and updates. We never sell your data to third parties.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Affiliate Tracking</h2>
          <p className="text-muted-foreground">
            We use industry-standard cookies to ensure we receive credit for referrals. These cookies do not store personal identifying information.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">User Rights</h2>
          <p className="text-muted-foreground">
            You may unsubscribe from our emails at any time using the link in the footer of our newsletters. To request data deletion, contact us at hello@getaidiscounts.com.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
