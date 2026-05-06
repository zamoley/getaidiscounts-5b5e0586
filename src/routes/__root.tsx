import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { NeuralBackdrop } from "@/components/NeuralBackdrop";
import { CookieConsent } from "@/components/CookieConsent";
import "@/i18n";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">That deal may have expired.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-electric px-4 py-2 text-sm font-medium text-electric-foreground hover:bg-electric-glow">
            Browse deals
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Get AI Discounts | Save BIG on your AI Stack" },
      { name: "description", content: "Verified daily promos for top AI tools like HeyGen and ElevenLabs." },
      { property: "og:title", content: "Get AI Discounts | Save BIG on your AI Stack" },
      { property: "og:description", content: "Verified daily promos for top AI tools like HeyGen and ElevenLabs." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://getaidiscounts.com/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:url", content: "https://getaidiscounts.com/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Get AI Discounts | Save BIG on your AI Stack" },
      { name: "twitter:description", content: "Verified daily promos for top AI tools like HeyGen and ElevenLabs." },
      { name: "twitter:image", content: "https://getaidiscounts.com/og-image.jpg" },
      { name: "twitter:url", content: "https://getaidiscounts.com/" },
      { name: "impact-site-verification", value: "9a364ba8-4292-45f6-89c8-e59fec32ffda" } as unknown as { name: string; content: string },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/svg+xml", href: "/owl.svg" },
      { rel: "apple-touch-icon", href: "/owl.svg" },
    ],
    scripts: [
      { type: "text/javascript", src: "https://s.skimresources.com/js/302516X1790516.skimlinks.js" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>
        <NeuralBackdrop />
        {children}
        <CookieConsent />
        <Toaster theme="dark" position="top-center" />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() { return <Outlet />; }
