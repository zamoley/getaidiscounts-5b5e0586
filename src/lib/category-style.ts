import {
  Image as ImageIcon, Video, Mic, Music, PenLine, MessageSquare,
  Code2, Bot, Globe, Briefcase, Sparkles, Zap, Scale, GraduationCap,
  Stethoscope, LineChart, ShoppingBag, Camera, FileText, Wand2,
  type LucideIcon,
} from "lucide-react";

/** Vibrant Obsidian-theme palette — picked deterministically for unknown categories. */
const PALETTE = [
  { color: "text-fuchsia-300", ring: "border-fuchsia-400/40 bg-fuchsia-500/10" },
  { color: "text-rose-300", ring: "border-rose-400/40 bg-rose-500/10" },
  { color: "text-amber-300", ring: "border-amber-400/40 bg-amber-500/10" },
  { color: "text-violet-300", ring: "border-violet-400/40 bg-violet-500/10" },
  { color: "text-emerald-300", ring: "border-emerald-400/40 bg-emerald-500/10" },
  { color: "text-sky-300", ring: "border-sky-400/40 bg-sky-500/10" },
  { color: "text-indigo-300", ring: "border-indigo-400/40 bg-indigo-500/10" },
  { color: "text-cyan-300", ring: "border-cyan-400/40 bg-cyan-500/10" },
  { color: "text-lime-300", ring: "border-lime-400/40 bg-lime-500/10" },
  { color: "text-pink-300", ring: "border-pink-400/40 bg-pink-500/10" },
];

const FALLBACK_ICONS: LucideIcon[] = [Sparkles, Zap, Wand2];

/** Stable hash so the same category always lands on the same color. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export type CategoryStyle = {
  Icon: LucideIcon;
  color: string;     // text color class
  ring: string;      // border + bg classes
  isKnown: boolean;
};

export function categoryStyle(category: string): CategoryStyle {
  const k = category.toLowerCase();

  // Known categories — curated icons + colors
  if (k.includes("image") || k.includes("photo")) return { Icon: ImageIcon, color: "text-fuchsia-300", ring: "border-fuchsia-400/40 bg-fuchsia-500/10", isKnown: true };
  if (k.includes("video")) return { Icon: Video, color: "text-rose-300", ring: "border-rose-400/40 bg-rose-500/10", isKnown: true };
  if (k.includes("voice") || k.includes("audio") || k.includes("speech")) return { Icon: Mic, color: "text-amber-300", ring: "border-amber-400/40 bg-amber-500/10", isKnown: true };
  if (k.includes("music")) return { Icon: Music, color: "text-violet-300", ring: "border-violet-400/40 bg-violet-500/10", isKnown: true };
  if (k.includes("writ")) return { Icon: PenLine, color: "text-emerald-300", ring: "border-emerald-400/40 bg-emerald-500/10", isKnown: true };
  if (k.includes("chat")) return { Icon: MessageSquare, color: "text-sky-300", ring: "border-sky-400/40 bg-sky-500/10", isKnown: true };
  if (k.includes("code") || k.includes("dev") || k.includes("no-code")) return { Icon: Code2, color: "text-indigo-300", ring: "border-indigo-400/40 bg-indigo-500/10", isKnown: true };
  if (k.includes("agent")) return { Icon: Bot, color: "text-cyan-300", ring: "border-cyan-400/40 bg-cyan-500/10", isKnown: true };
  if (k.includes("search")) return { Icon: Globe, color: "text-blue-300", ring: "border-blue-400/40 bg-blue-500/10", isKnown: true };
  if (k.includes("product") || k.includes("business")) return { Icon: Briefcase, color: "text-slate-200", ring: "border-slate-400/40 bg-slate-500/10", isKnown: true };
  if (k.includes("legal") || k.includes("law")) return { Icon: Scale, color: "text-amber-200", ring: "border-amber-400/40 bg-amber-500/10", isKnown: true };
  if (k.includes("educat") || k.includes("learn")) return { Icon: GraduationCap, color: "text-emerald-200", ring: "border-emerald-400/40 bg-emerald-500/10", isKnown: true };
  if (k.includes("health") || k.includes("medic")) return { Icon: Stethoscope, color: "text-rose-200", ring: "border-rose-400/40 bg-rose-500/10", isKnown: true };
  if (k.includes("finance") || k.includes("market")) return { Icon: LineChart, color: "text-teal-300", ring: "border-teal-400/40 bg-teal-500/10", isKnown: true };
  if (k.includes("shop") || k.includes("commerce")) return { Icon: ShoppingBag, color: "text-pink-300", ring: "border-pink-400/40 bg-pink-500/10", isKnown: true };
  if (k.includes("design")) return { Icon: Camera, color: "text-fuchsia-200", ring: "border-fuchsia-400/40 bg-fuchsia-500/10", isKnown: true };
  if (k.includes("doc") || k.includes("pdf") || k.includes("note")) return { Icon: FileText, color: "text-cyan-200", ring: "border-cyan-400/40 bg-cyan-500/10", isKnown: true };

  // Unknown → deterministic random vibrant palette + Sparkles/Zap fallback icon
  const h = hash(k);
  const palette = PALETTE[h % PALETTE.length];
  const Icon = FALLBACK_ICONS[h % FALLBACK_ICONS.length];
  return { Icon, color: palette.color, ring: palette.ring, isKnown: false };
}
