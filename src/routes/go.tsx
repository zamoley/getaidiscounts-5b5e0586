import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAllowedRedirect } from "@/lib/redirect-allowlist";

type GoSearch = {
  url?: string;
  tool?: string;
};

function validateGoSearch(search: Record<string, unknown>): GoSearch {
  return {
    url: typeof search.url === "string" ? search.url : undefined,
    tool: typeof search.tool === "string" ? search.tool : undefined,
  };
}

function getSafeTarget(search: GoSearch) {
  return search.url ? isAllowedRedirect(search.url) : null;
}

function cleanToolName(value?: string) {
  const trimmed = value?.trim().replace(/\s+/g, " ");
  return trimmed ? trimmed.slice(0, 60) : undefined;
}

function titleCaseHostPart(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) =>
      part.toLowerCase() === "ai" ? "AI" : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

function getDisplayName(targetUrl: string, tool?: string) {
  const explicit = cleanToolName(tool);
  if (explicit) return explicit;

  try {
    const hostname = new URL(targetUrl).hostname.replace(/^www\./, "").toLowerCase();
    const parts = hostname.split(".");
    const core = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
    const known: Record<string, string> = {
      base44: "Base44",
      cursor: "Cursor",
      openai: "OpenAI",
      elevenlabs: "ElevenLabs",
      midjourney: "Midjourney",
      heygen: "HeyGen",
    };
    return known[core] ?? titleCaseHostPart(core);
  } catch {
    return "the partner site";
  }
}

function isFramed() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function removeMetaRefresh() {
  document.querySelectorAll('meta[http-equiv="refresh"]').forEach((node) => node.remove());
}

function upsertMetaRefresh(targetUrl: string) {
  const existing = document.querySelector<HTMLMetaElement>('meta[http-equiv="refresh"]');
  const meta = existing ?? document.createElement("meta");
  meta.setAttribute("http-equiv", "refresh");
  meta.setAttribute("content", `2;url=${targetUrl}`);
  if (!existing) document.head.appendChild(meta);
}

function upsertReferrerPolicy() {
  const existing = document.querySelector<HTMLMetaElement>('meta[name="referrer"]');
  const meta = existing ?? document.createElement("meta");
  meta.setAttribute("name", "referrer");
  meta.setAttribute("content", "no-referrer-when-downgrade");
  if (!existing) document.head.appendChild(meta);
}

function burstToTopWindow(targetUrl: string) {
  try {
    window.top?.location.replace(targetUrl);
    return;
  } catch {
    // Cross-origin frame access can throw; use the safe same-window fallback below.
  }

  if (!isFramed()) {
    try {
      window.location.replace(targetUrl);
    } catch {
      // The manual fallback button remains available if browser navigation is blocked.
    }
  }
}

export const Route = createFileRoute("/go")({
  validateSearch: validateGoSearch,
  head: ({ match }) => {
    const target = getSafeTarget(match.search);
    return {
      meta: [
        { title: "Redirecting… — GetAIDiscounts" },
        { name: "robots", content: "noindex,nofollow" },
        { name: "description", content: "Redirecting you to a partner offer." },
        { name: "referrer", content: "no-referrer-when-downgrade" },
        ...(target ? [{ httpEquiv: "refresh", content: `2;url=${target}` }] : []),
      ],
    };
  },
  component: GoPage,
});

function GoPage() {
  const [target, setTarget] = useState<string | null>(null);
  const [toolName, setToolName] = useState("the partner site");
  const [showFallback, setShowFallback] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const destinationHost = useMemo(() => {
    if (!target) return "";
    try {
      return new URL(target).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }, [target]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");
    const tool = params.get("tool") ?? undefined;
    if (!url) {
      setBlocked(true);
      return;
    }
    const safe = isAllowedRedirect(url);
    if (!safe) {
      setBlocked(true);
      return;
    }
    setTarget(safe);
    setToolName(getDisplayName(safe, tool));
    upsertReferrerPolicy();
    upsertMetaRefresh(safe);

    const framed = isFramed();
    const redirectTimer = window.setTimeout(() => burstToTopWindow(safe), 100);
    const refreshGuardTimer = framed ? window.setTimeout(removeMetaRefresh, 1800) : undefined;
    const fallbackTimer = window.setTimeout(() => setShowFallback(true), 3000);

    return () => {
      window.clearTimeout(redirectTimer);
      if (refreshGuardTimer) window.clearTimeout(refreshGuardTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  if (blocked) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Redirect blocked</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This destination isn't on our list of approved partner sites.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="flex max-w-lg flex-col items-center text-center">
        <div className="relative mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-electric/20 bg-obsidian shadow-[var(--shadow-electric)]">
          <span className="absolute inset-2 rounded-full border border-electric/10" />
          <span className="absolute inset-0 rounded-full border-t-2 border-electric animate-spin" />
          <Loader2 className="h-9 w-9 animate-spin text-electric" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Redirecting…</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sending you to the partner site. You're leaving GetAIDiscounts.com.
        </p>
        {target && showFallback && (
          <div className="mt-8 flex w-full flex-col items-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 w-full max-w-sm bg-electric px-6 text-base font-semibold text-electric-foreground shadow-[var(--shadow-electric)] hover:bg-electric-glow"
            >
              <a
                href={target}
                target="_top"
                rel="noopener sponsored"
                referrerPolicy="no-referrer-when-downgrade"
                onClick={() => burstToTopWindow(target)}
              >
                Continue to {toolName}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            {destinationHost && (
              <p className="break-all text-xs text-muted-foreground">{destinationHost}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
