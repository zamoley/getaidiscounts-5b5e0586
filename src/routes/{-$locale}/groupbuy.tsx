import { createFileRoute } from "@tanstack/react-router";
import { fetchDeals, type Deal } from "@/lib/deals";
import { CategoryPage } from "@/components/CategoryPage";
import { CATEGORIES } from "@/lib/categories";
import { hreflangLinks, canonicalFor } from "@/i18n/seo";

const cfg = CATEGORIES.groupbuy;

export const Route = createFileRoute("/{-$locale}/groupbuy")({
  loader: () => fetchDeals(),
  head: ({ params }) => {
    const loc = (params as { locale?: string }).locale ?? "en";
    return {
      links: [
        ...hreflangLinks("/groupbuy"),
        { rel: "canonical", href: canonicalFor(loc, "/groupbuy") },
      ],
      meta: [
        { title: `${cfg.h1} | GetAIDiscounts` },
        { name: "description", content: cfg.intro },
        { property: "og:title", content: `${cfg.h1} | GetAIDiscounts` },
        { property: "og:description", content: cfg.intro },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: loc },
        { property: "og:url", content: canonicalFor(loc, "/groupbuy") },
      ],
    };
  },
  component: () => <CategoryPage deals={Route.useLoaderData() as Deal[]} config={cfg} />,
  errorComponent: ({ error }) => <div className="p-10 text-center text-muted-foreground">Failed to load: {error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Not found</div>,
});
