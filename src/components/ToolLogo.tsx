import { useMemo, useState } from "react";
import {
  Image as ImageIcon, MessageSquare, Video, Mic, PenLine, Music,
  Code2, Bot, Briefcase, Globe, Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

function domainFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function categoryStyle(category?: string): { Icon: LucideIcon; gradient: string; color: string } {
  const k = (category ?? "").toLowerCase();
  if (k.includes("image")) return { Icon: ImageIcon, gradient: "from-fuchsia-500/30 to-pink-500/10", color: "text-fuchsia-300" };
  if (k.includes("video")) return { Icon: Video, gradient: "from-rose-500/30 to-orange-500/10", color: "text-rose-300" };
  if (k.includes("voice") || k.includes("audio")) return { Icon: Mic, gradient: "from-amber-500/30 to-yellow-500/10", color: "text-amber-300" };
  if (k.includes("music")) return { Icon: Music, gradient: "from-violet-500/30 to-purple-500/10", color: "text-violet-300" };
  if (k.includes("writ")) return { Icon: PenLine, gradient: "from-emerald-500/30 to-teal-500/10", color: "text-emerald-300" };
  if (k.includes("chat")) return { Icon: MessageSquare, gradient: "from-sky-500/30 to-blue-500/10", color: "text-sky-300" };
  if (k.includes("code") || k.includes("dev")) return { Icon: Code2, gradient: "from-indigo-500/30 to-blue-500/10", color: "text-indigo-300" };
  if (k.includes("agent")) return { Icon: Bot, gradient: "from-cyan-500/30 to-teal-500/10", color: "text-cyan-300" };
  if (k.includes("search")) return { Icon: Globe, gradient: "from-blue-500/30 to-cyan-500/10", color: "text-blue-300" };
  if (k.includes("product")) return { Icon: Briefcase, gradient: "from-slate-500/30 to-zinc-500/10", color: "text-slate-200" };
  return { Icon: Sparkles, gradient: "from-electric/30 to-electric/5", color: "text-electric" };
}

export function ToolLogo({
  tool,
  url,
  category,
  size = 44,
  className = "",
}: {
  tool: string;
  url: string;
  category?: string;
  size?: number;
  className?: string;
}) {
  const domain = useMemo(() => {
    const d = domainFromUrl(url);
    if (!d) return null;
    const parts = d.split(".");
    return parts.length > 2 ? parts.slice(-2).join(".") : d;
  }, [url]);
  // 0 = Clearbit, 1 = Google favicon (s2), 2 = DuckDuckGo, 3 = icon fallback
  const [stage, setStage] = useState(0);
  const { Icon, gradient, color } = categoryStyle(category);

  const src = useMemo(() => {
    if (!domain) return null;
    if (stage === 0) return `https://logo.clearbit.com/${domain}?size=128`;
    if (stage === 1) return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
    if (stage === 2) return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    return null;
  }, [domain, stage]);

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 overflow-hidden rounded-full border border-border/60 bg-gradient-to-br ${gradient} ${className}`}
      title={tool}
    >
      {src ? (
        <img
          // key forces a fresh <img> per stage so onError fires reliably during fallback chain
          key={src}
          src={src}
          alt={`${tool} logo`}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setStage(s => s + 1)}
          className="h-full w-full bg-white object-contain p-1.5"
        />
      ) : (
        <div className={`flex h-full w-full items-center justify-center ${color}`}>
          <Icon style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={2} />
        </div>
      )}
    </div>
  );
}
