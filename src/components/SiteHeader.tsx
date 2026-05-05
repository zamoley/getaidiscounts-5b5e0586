import { Link, useLocation } from "@tanstack/react-router";
import { OwlLogo } from "@/components/OwlLogo";
import { RequestDealButton } from "@/components/RequestDealButton";

const NAV = [
  { slug: "video", label: "Video" },
  { slug: "voice", label: "Voice" },
  { slug: "writing", label: "Writing" },
  { slug: "agents", label: "Agents" },
  { slug: "code", label: "Code" },
  { slug: "music", label: "Music" },
] as const;

export function SiteHeader() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <OwlLogo className="h-9 w-9" />
          <span className="text-lg font-bold tracking-tight">
            Get<span className="text-electric">AI</span>Discounts
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === `/${item.slug}`;
            return (
              <Link
                key={item.slug}
                to={`/${item.slug}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition-all ${
                  active
                    ? "bg-electric/15 text-electric ring-1 ring-electric/40"
                    : "text-foreground/85 hover:bg-secondary hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <RequestDealButton />
        </div>
      </div>

      {/* Mobile nav row */}
      <nav className="flex items-center gap-1 overflow-x-auto px-4 pb-3 md:hidden">
        {NAV.map((item) => {
          const active = pathname === `/${item.slug}`;
          return (
            <Link
              key={item.slug}
              to={`/${item.slug}`}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                active
                  ? "bg-electric/15 text-electric ring-1 ring-electric/40"
                  : "text-foreground/85 hover:bg-secondary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
