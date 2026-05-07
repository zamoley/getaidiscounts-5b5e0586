export type Deal = {
  id: string;
  tool_name: string;
  tool: string;
  category?: string;
  description?: string;
  discount: string;
  code?: string;
  url: string;
  lastVerified: string;
  logo?: string;
  pricing?: string;
  specs?: string;
  source?: string;
  featured?: boolean;
};

// Featured partners — always sorted to the top of their category.
const FEATURED_TOOLS = new Set<string>(["base44"]);

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const fallbackDeals: Deal[] = ([
  { id: "midjourney", tool: "Midjourney", category: "Image", description: "Premium AI image generation with cinematic quality.", discount: "20% OFF", code: "AIDISC20", url: "https://www.midjourney.com", lastVerified: "2026-04-28", pricing: "From $10/mo", specs: "Discord + Web · v6 model" },
  { id: "chatgpt-plus", tool: "ChatGPT Plus", category: "Chat", description: "GPT-5 access, advanced data analysis, and priority speed.", discount: "$20 CREDIT", code: "GETAI20", url: "https://chat.openai.com", lastVerified: "2026-05-01", pricing: "$20/mo", specs: "GPT-5 · Vision · Code interpreter" },
  { id: "claude-pro", tool: "Claude Pro", category: "Chat", description: "Anthropic's Claude with longer context and Projects.", discount: "1 MONTH FREE", code: "CLAUDEFREE", url: "https://claude.ai", lastVerified: "2026-04-30", pricing: "$20/mo", specs: "200K context · Projects · Artifacts" },
  { id: "perplexity", tool: "Perplexity Pro", category: "Search", description: "AI-powered answer engine with cited sources.", discount: "1 YEAR FREE", code: "PPLXYEAR", url: "https://perplexity.ai", lastVerified: "2026-05-02", pricing: "$20/mo", specs: "Multi-model · Cited sources" },
  { id: "elevenlabs", tool: "ElevenLabs", category: "Audio", description: "Hyper-realistic voice cloning and dubbing.", discount: "30% OFF", code: "VOICE30", url: "https://elevenlabs.io", lastVerified: "2026-04-25", pricing: "From $5/mo", specs: "29 languages · Voice cloning" },
  { id: "runway", tool: "Runway ML", category: "Video", description: "Gen-3 text-to-video and editing suite.", discount: "25% OFF", code: "RUNWAY25", url: "https://runwayml.com", lastVerified: "2026-04-22", pricing: "From $15/mo", specs: "Gen-3 · 4K export" },
  { id: "notion-ai", tool: "Notion AI", category: "Productivity", description: "AI writing inside your Notion workspace.", discount: "2 MONTHS FREE", code: "NOTION2M", url: "https://notion.so", lastVerified: "2026-04-29", pricing: "$10/mo add-on", specs: "Q&A · Autofill · Translate" },
  { id: "github-copilot", tool: "GitHub Copilot", category: "Coding", description: "AI pair programmer right in your editor.", discount: "FREE TRIAL", code: "COPILOT30", url: "https://github.com/features/copilot", lastVerified: "2026-05-03", pricing: "$10/mo", specs: "VS Code · JetBrains · Neovim" },
  { id: "cursor", tool: "Cursor", category: "Coding", description: "The AI-native code editor built on VS Code.", discount: "20% OFF", code: "CURSOR20", url: "https://cursor.sh", lastVerified: "2026-05-01", pricing: "$20/mo", specs: "Composer · Tab · Agent mode" },
  { id: "jasper", tool: "Jasper AI", category: "Writing", description: "Marketing-focused AI content generation.", discount: "20% OFF", code: "JASPER20", url: "https://jasper.ai", lastVerified: "2026-04-18", pricing: "From $39/mo", specs: "Brand voice · 30+ templates" },
  { id: "synthesia", tool: "Synthesia", category: "Video", description: "AI avatars for studio-quality video at scale.", discount: "15% OFF", code: "SYNTH15", url: "https://synthesia.io", lastVerified: "2026-04-20", pricing: "From $29/mo", specs: "230+ avatars · 140 languages" },
  { id: "descript", tool: "Descript", category: "Audio", description: "Edit audio and video by editing text.", discount: "30% OFF", code: "DESCRIPT30", url: "https://descript.com", lastVerified: "2026-04-27", pricing: "From $12/mo", specs: "Overdub · Studio Sound" },
]).map((deal) => ({ ...deal, tool_name: deal.tool }));

const REMOTE_URL = "https://raw.githubusercontent.com/zamoley/getaidiscounts-5b5e0586/main/ai_deals.json";

function cleanString(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

function normalize(raw: any, idx: number): Deal {
  const toolName = cleanString(raw?.tool_name) ?? cleanString(raw?.tool) ?? cleanString(raw?.name) ?? "Unknown";
  const id = String(raw?.id ?? raw?.slug ?? toolName ?? idx).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `deal-${idx}`;
  return {
    id,
    tool_name: toolName,
    tool: toolName,
    category: raw?.category ? String(raw.category) : undefined,
    description: raw?.description ?? raw?.desc ? String(raw.description ?? raw.desc) : undefined,
    discount: String(raw?.discount ?? raw?.discount_amount ?? raw?.deal ?? "DEAL"),
    code: raw?.code ?? raw?.coupon ? String(raw.code ?? raw.coupon) : undefined,
    url: String(raw?.affiliate_link ?? raw?.url ?? raw?.tool_url ?? raw?.link ?? "#"),
    lastVerified: String(raw?.lastVerified ?? raw?.last_verified ?? raw?.verified ?? new Date().toISOString().slice(0, 10)),
    logo: raw?.logo ? String(raw.logo) : undefined,
    pricing: raw?.pricing ?? raw?.pricing_info ?? raw?.price ? String(raw.pricing ?? raw.pricing_info ?? raw.price) : undefined,
    specs: raw?.specs ?? raw?.key_features ?? raw?.features ? String(raw.specs ?? raw.key_features ?? raw.features) : undefined,
    source: raw?.source ?? raw?.via ?? raw?.partner ? String(raw.source ?? raw.via ?? raw.partner) : undefined,
    featured: raw?.featured === true || FEATURED_TOOLS.has(id) || FEATURED_TOOLS.has(slugify(toolName)),
  };
}

function sortFeatured(deals: Deal[]): Deal[] {
  return [...deals].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
}

export async function fetchDeals(): Promise<Deal[]> {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : undefined;
  const timeout = setTimeout(() => controller?.abort(), 3500);
  try {
    const res = await fetch(REMOTE_URL, { cache: "no-store", signal: controller?.signal });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const arr = Array.isArray(data) ? data : (data?.deals ?? data?.tools ?? []);
    if (!arr.length) throw new Error("empty");
    return sortFeatured(arr.map(normalize));
  } catch {
    return sortFeatured(fallbackDeals);
  } finally {
    clearTimeout(timeout);
  }
}

