import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { gaPageView } from "@/lib/analytics";

export function AnalyticsTracker() {
  const router = useRouter();

  useEffect(() => {
    // Initial page view
    gaPageView(window.location.pathname + window.location.search);

    const unsub = router.subscribe("onResolved", ({ toLocation }) => {
      gaPageView(toLocation.pathname + (toLocation.searchStr ?? ""));
    });
    return () => unsub();
  }, [router]);

  return null;
}
