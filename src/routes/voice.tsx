import { createFileRoute } from "@tanstack/react-router";
import { fetchDeals, type Deal } from "@/lib/deals";
import { CategoryPage } from "@/components/CategoryPage";
import { CATEGORIES } from "@/lib/categories";

const cfg = CATEGORIES.voice;

export const Route = createFileRoute("/voice")({
  loader: () => fetchDeals(),
  head: () => ({
    meta: [
      { title: `${cfg.h1} | GetAIDiscounts` },
      { name: "description", content: cfg.intro },
      { property: "og:title", content: `${cfg.h1} | GetAIDiscounts` },
      { property: "og:description", content: cfg.intro },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => <CategoryPage deals={Route.useLoaderData() as Deal[]} config={cfg} />,
  errorComponent: ({ error }) => <div className="p-10 text-center text-muted-foreground">Failed to load: {error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Not found</div>,
});
