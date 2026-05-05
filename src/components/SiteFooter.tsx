import { Link } from "@tanstack/react-router";

export function SiteFooter({ showDisclosure = false }: { showDisclosure?: boolean }) {
  return (
    <footer className="mx-auto max-w-7xl border-t border-border/60 px-6 py-10 text-sm text-muted-foreground">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
        <div className="text-center md:text-left">
          © {new Date().getFullYear()} GetAIDiscounts.com — Some links are monetized via Skimlinks.
        </div>
        <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span className="font-semibold uppercase tracking-wider text-foreground/70">Legal</span>
          <Link to="/privacy" className="hover:text-electric">Privacy</Link>
          <Link to="/terms" className="hover:text-electric">Terms</Link>
          <Link to="/affiliate-disclosure" className="hover:text-electric">Affiliate Disclosure</Link>
        </nav>
      </div>
      {showDisclosure && (
        <p className="mt-6 text-center text-xs italic text-muted-foreground/80">
          Disclosure: GetAIDiscounts.com is an independent directory supported by our audience. When you purchase through links on our site, we may earn an affiliate commission at no extra cost to you. Our editorial choices are independent and not influenced by our affiliate status.
        </p>
      )}
    </footer>
  );
}
