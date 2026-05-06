// Dynamic allowlist for the /go redirector.
//
// Hosts are derived automatically from the live ai_deals.json feed (plus the
// bundled fallback list), so any tool the harvester adds becomes redirectable
// without manual approval. A small static seed covers affiliate networks and
// guarantees the common partners always work even if the feed is unreachable.

import { fallbackDeals, fetchDeals, type Deal } from "./deals";

const STATIC_SEED = new Set<string>([
  // Affiliate networks
  "impact.com",
  "go.impact.com",
  "trk.impact.com",
  "skimlinks.com",
  "go.skimresources.com",
  // Lovable / first-party
  "lovable.dev",
  "lovable.app",
  "getaidiscounts.com",
]);

function hostFromUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (!/^https?:$/.test(u.protocol)) return null;
    return u.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function registrableRoot(host: string): string {
  // Treat foo.bar.example.com as example.com so any subdomain matches.
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  return parts.slice(-2).join(".");
}

function buildHostSet(deals: Deal[]): Set<string> {
  const set = new Set<string>(STATIC_SEED);
  for (const d of deals) {
    const host = hostFromUrl(d.url);
    if (!host) continue;
    set.add(host);
    set.add(registrableRoot(host));
  }
  return set;
}

// Seed the in-memory allowlist with the bundled fallback feed so SSR and the
// first paint already accept those destinations.
let allowedHosts: Set<string> = buildHostSet(fallbackDeals);
let dealsLoader: Promise<Set<string>> | null = null;

export function ensureAllowlistLoaded(): Promise<Set<string>> {
  if (!dealsLoader) {
    dealsLoader = fetchDeals()
      .then((deals) => {
        allowedHosts = buildHostSet([...fallbackDeals, ...deals]);
        return allowedHosts;
      })
      .catch(() => allowedHosts);
  }
  return dealsLoader;
}

function matches(host: string): boolean {
  if (allowedHosts.has(host)) return true;
  for (const allowed of allowedHosts) {
    if (host === allowed || host.endsWith(`.${allowed}`)) return true;
  }
  return false;
}

export function isAllowedRedirect(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (!/^https?:$/.test(parsed.protocol)) return null;
    const host = parsed.hostname.toLowerCase();
    return matches(host) ? parsed.toString() : null;
  } catch {
    return null;
  }
}
