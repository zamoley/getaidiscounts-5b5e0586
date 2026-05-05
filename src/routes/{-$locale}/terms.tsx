import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { hreflangLinks, canonicalFor } from "@/i18n/seo";

export const Route = createFileRoute("/{-$locale}/terms")({
  head: ({ params }) => {
    const loc = (params as { locale?: string }).locale ?? "en";
    return {
    links: [
      ...hreflangLinks("/terms"),
      { rel: "canonical", href: canonicalFor(loc, "/terms") },
    ],
    meta: [
      { title: "Terms of Service | GetAIDiscounts" },
      { name: "description", content: "The terms governing your use of GetAIDiscounts.com." },
    ,
      { property: "og:locale", content: loc },
      { property: "og:url", content: canonicalFor(loc, "/terms") },
    ],
    };
  },
  component: TermsPage,
});

function TermsPage() {
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service for GetAIDiscounts.com</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last Updated: {today}</p>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">No Guarantees</h2>
          <p className="text-muted-foreground">
            While we strive for 100% accuracy, we do not guarantee that every discount code will work. All codes are provided "as-is" from third-party sources.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Third-Party Links</h2>
          <p className="text-muted-foreground">
            Our site contains links to external websites. We are not responsible for the content, privacy policies, or actions of these third-party tools.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            GetAIDiscounts.com and its owners are not liable for any financial decisions or issues arising from the use of the AI tools listed on this site.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Acceptance</h2>
          <p className="text-muted-foreground">
            By using this site, you agree to these terms.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
