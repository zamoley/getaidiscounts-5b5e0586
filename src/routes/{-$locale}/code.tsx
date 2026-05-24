import { createFileRoute } from "@tanstack/react-router";
import { fetchDeals, type Deal } from "@/lib/deals";
import { CategoryPage } from "@/components/CategoryPage";
import { CATEGORIES } from "@/lib/categories";
import { hreflangLinks, canonicalFor } from "@/i18n/seo";

const cfg = CATEGORIES.code;

export const Route = createFileRoute("/{-$locale}/code")({
  loader: () => fetchDeals(),
  head: ({ params }) => {
    const loc = (params as { locale?: string }).locale ?? "en";
    return {
    links: [
      ...hreflangLinks("/code"),
      { rel: "canonical", href: canonicalFor(loc, "/code") },
    ],
    meta: [
      { title: `${cfg.h1} | GetAIDiscounts` },
      { name: "description", content: cfg.intro },
      { property: "og:title", content: `${cfg.h1} | GetAIDiscounts` },
      { property: "og:description", content: cfg.intro },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: loc },
      { property: "og:url", content: canonicalFor(loc, "/code") },
    ],
    };
  },
  component: () => <CategoryPage deals={Route.useLoaderData() as Deal[]} config={cfg} />,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-muted-foreground">
      Failed to load deals — please try again.
      {import.meta.env.DEV && error?.message ? (
        <pre className="mt-3 text-xs opacity-70">{error.message}</pre>
      ) : null}
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Not found</div>,
});
