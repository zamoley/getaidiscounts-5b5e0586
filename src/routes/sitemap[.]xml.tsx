import { createFileRoute } from "@tanstack/react-router";
import { SUPPORTED_CODES } from "@/i18n";
import { CATEGORIES } from "@/lib/categories";

const SITE = "https://getaidiscounts.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = ["/", ...Object.keys(CATEGORIES).map((s) => `/${s}`)];
        const lastmod = new Date().toISOString().split("T")[0];

        const urls: string[] = [];
        for (const path of paths) {
          const tail = path === "/" ? "" : path;
          const alternates = SUPPORTED_CODES.map((code) => {
            const href = code === "en" ? `${SITE}${path}` : `${SITE}/${code}${tail}`;
            return `    <xhtml:link rel="alternate" hreflang="${code}" href="${href}" />`;
          }).join("\n");
          const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${path}" />`;

          for (const code of SUPPORTED_CODES) {
            const loc = code === "en" ? `${SITE}${path}` : `${SITE}/${code}${tail}`;
            urls.push(
              `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n${xDefault}\n  </url>`
            );
          }
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
