import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { isAllowedRedirect } from "@/lib/redirect-allowlist";

export const Route = createFileRoute("/go")({
  head: () => ({
    meta: [
      { title: "Redirecting… — GetAIDiscounts" },
      { name: "robots", content: "noindex,nofollow" },
      { name: "description", content: "Redirecting you to a partner offer." },
    ],
  }),
  component: GoPage,
});

function GoPage() {
  const [target, setTarget] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");
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
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-electric/30 to-electric/5">
          <Loader2 className="h-10 w-10 animate-spin text-electric" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Redirecting…</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sending you to the partner site. You're leaving GetAIDiscounts.com.
        </p>
        {target && (
          <p className="mt-6 break-all text-xs text-muted-foreground">
            Not redirected?{" "}
            <a href={target} className="text-electric underline underline-offset-4">
              Continue to {new URL(target).hostname}
            </a>
          </p>
        )}
      </div>
    </main>
  );
}

