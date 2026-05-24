import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { hreflangLinks, canonicalFor } from "@/i18n/seo";

export const Route = createFileRoute("/{-$locale}/about")({
  head: ({ params }) => {
    const loc = (params as { locale?: string }).locale ?? "en";
    return {
      links: [
        ...hreflangLinks("/about"),
        { rel: "canonical", href: canonicalFor(loc, "/about") },
      ],
      meta: [
        { title: "About | GetAIDiscounts" },
        {
          name: "description",
          content:
            "GetAIDiscounts is a community-driven directory helping global creators and developers access premium AI tools at affordable prices.",
        },
        { property: "og:title", content: "About | GetAIDiscounts" },
        {
          property: "og:description",
          content:
            "Our mission: bridge the digital divide by making world-class AI accessible to everyone, regardless of budget or location.",
        },
        { property: "og:locale", content: loc },
        { property: "og:url", content: canonicalFor(loc, "/about") },
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">About GetAIDiscounts</h1>

        <section className="mt-8 space-y-4 text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">GetAIDiscounts</strong> is a
            community-driven directory dedicated to helping global creators and
            developers access premium AI tools at affordable prices.
          </p>
          <p>
            We hand-pick promo codes, exclusive partner deals, and verified
            discounts across the AI tools you actually use — from image and
            video generation to coding copilots, voice models, and AI agents —
            and update them daily.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our mission is to{" "}
            <em className="text-foreground">
              bridge the digital divide by making world-class AI accessible to
              everyone, regardless of their budget or location.
            </em>{" "}
            Whether you're a solo creator in São Paulo, a student in Lagos, or a
            startup team in Berlin, you deserve the same access to the tools
            shaping the next decade of work and creativity.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="text-2xl font-semibold">How We Work</h2>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground leading-relaxed">
            <li>Every deal is sourced from official vendors or verified partners.</li>
            <li>Codes are re-checked daily and flagged by our community when they break.</li>
            <li>
              A tool's affiliate status never determines whether we list it or
              how we describe its discount.
            </li>
          </ul>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
