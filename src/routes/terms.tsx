import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | GetAIDiscounts" },
      { name: "description", content: "The terms governing your use of GetAIDiscounts." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Use of the Site</h2>
          <p className="text-muted-foreground">
            GetAIDiscounts provides a curated directory of AI tool discounts and promo codes for
            informational purposes. Codes and pricing are subject to change without notice.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">No Warranty</h2>
          <p className="text-muted-foreground">
            We verify deals regularly but make no guarantee that any code or offer will work at
            the time you use it. Your transactions are between you and the third-party tool.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Trademarks</h2>
          <p className="text-muted-foreground">
            All product names, logos, and brands are property of their respective owners and are
            used for identification purposes only.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">hello@getaidiscounts.com</p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
