import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/go")({
  head: () => ({
    meta: [
      { title: "Fetching your discount… — GetAIDiscounts" },
      { name: "robots", content: "noindex,nofollow" },
      { name: "description", content: "Redirecting you to your verified AI discount." },
    ],
  }),
  component: GoPage,
});

function GoPage() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");
    if (!url) return;
    let safe = url;
    try {
      const parsed = new URL(url);
      if (!/^https?:$/.test(parsed.protocol)) return;
      safe = parsed.toString();
    } catch {
      return;
    }
    setTarget(safe);
    // Top-level replace so Skimlinks can rewrite the click, the destination
    // is never framed (avoids X-Frame-Options/CSP errors), and Back doesn't
    // bounce the user back into this redirector.
    const t = setTimeout(() => {
      try {
        if (window.top && window.top !== window.self) {
          window.top.location.replace(safe);
          return;
        }
      } catch {}
      window.location.replace(safe);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-electric/30 to-electric/5">
          <Loader2 className="h-10 w-10 animate-spin text-electric" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Fetching your discount…</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Applying your code and routing you to the verified offer.
        </p>
        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-electric" />
          Secured by GetAIDiscounts
        </div>
        {target && (
          <p className="mt-6 text-xs text-muted-foreground">
            Not redirected?{" "}
            <a href={target} className="text-electric underline underline-offset-4">
              Click here
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
