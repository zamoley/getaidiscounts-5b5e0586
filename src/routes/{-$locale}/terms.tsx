import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
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
      { property: "og:locale", content: loc },
      { property: "og:url", content: canonicalFor(loc, "/terms") },
    ],
    };
  },
  component: TermsPage,
});

function TermsPage() {
  const { t } = useTranslation();
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">{t("terms.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("terms.updated", { date: today })}</p>

        {(["aff", "ng", "tp", "ll", "acc"] as const).map((k) => (
          <section key={k} className="mt-8 space-y-3">
            <h2 className="text-2xl font-semibold">{t(`terms.${k}_h`)}</h2>
            <p className="text-muted-foreground">{t(`terms.${k}_p`)}</p>
          </section>
        ))}
      </article>
      <SiteFooter />
    </main>
  );
}
