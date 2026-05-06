// Allowlist of hostnames the /go redirector may forward to.
// Extend cautiously — every domain here inherits the GetAIDiscounts trust signal.
const ALLOWED_HOSTS = new Set<string>([
  "midjourney.com",
  "openai.com",
  "chat.openai.com",
  "claude.ai",
  "anthropic.com",
  "perplexity.ai",
  "elevenlabs.io",
  "runwayml.com",
  "notion.so",
  "github.com",
  "cursor.sh",
  "cursor.com",
  "jasper.ai",
  "synthesia.io",
  "descript.com",
  // Affiliate networks
  "impact.com",
  "go.impact.com",
  "trk.impact.com",
  "skimlinks.com",
  "go.skimresources.com",
]);

export function isAllowedRedirect(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (!/^https?:$/.test(parsed.protocol)) return null;
    const host = parsed.hostname.toLowerCase();
    const ok = Array.from(ALLOWED_HOSTS).some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`)
    );
    return ok ? parsed.toString() : null;
  } catch {
    return null;
  }
}
