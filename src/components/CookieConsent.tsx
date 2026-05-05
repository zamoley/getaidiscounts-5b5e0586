import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const KEY = "gad_cookie_consent_v1";

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);

  if (!show) return null;

  const accept = () => {
    try { localStorage.setItem(KEY, "accepted"); } catch {}
    setShow(false);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
      <div className="pointer-events-auto flex w-full max-w-3xl flex-col items-center gap-3 rounded-2xl border border-border bg-card/95 px-5 py-4 text-sm text-foreground/90 shadow-[var(--shadow-card)] backdrop-blur sm:flex-row sm:justify-between">
        <p className="text-center sm:text-left">
          {t("cookie.text")}
        </p>
        <Button onClick={accept} className="bg-electric text-electric-foreground hover:bg-electric-glow">
          {t("cookie.accept")}
        </Button>
      </div>
    </div>
  );
}
