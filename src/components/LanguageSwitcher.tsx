import { Globe, Check } from "lucide-react";
import { useNavigate, useLocation, type NavigateOptions } from "@tanstack/react-router";
import { SUPPORTED_LANGUAGES, type LangCode } from "@/i18n";
import { useLocale, isLang } from "@/i18n/use-locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const current = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === current);

  const switchTo = (code: LangCode) => {
    // strip existing locale prefix
    const segs = location.pathname.split("/").filter(Boolean);
    if (segs.length && isLang(segs[0])) segs.shift();
    const rest = "/" + segs.join("/");
    const next = code === "en" ? (rest === "/" ? "/" : rest) : `/${code}${rest === "/" ? "" : rest}`;
    navigate({ to: next as NavigateOptions["to"], search: (prev) => prev });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Select language"
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 text-xs font-semibold text-foreground/80 transition-all hover:border-electric/50 hover:text-electric focus:outline-none focus-visible:ring-2 focus-visible:ring-electric/60"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{currentLang?.native ?? "English"}</span>
        <span className="sm:hidden uppercase">{current}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[180px] border-border bg-card/95 backdrop-blur-xl"
      >
        {SUPPORTED_LANGUAGES.map(lang => {
          const active = lang.code === current;
          return (
            <DropdownMenuItem
              key={lang.code}
              onSelect={() => switchTo(lang.code)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-md text-sm ${
                active ? "text-electric" : "text-foreground/85"
              } focus:bg-electric/10 focus:text-electric`}
            >
              <span>{lang.native}</span>
              {active && <Check className="h-3.5 w-3.5" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
