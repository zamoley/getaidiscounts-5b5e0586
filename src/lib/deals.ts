export type Deal = {
  id: string;
  tool: string;
  category?: string;
  description?: string;
  discount: string;
  code?: string;
  url: string;
  lastVerified: string; // ISO date
  logo?: string;
};

export const fallbackDeals: Deal[] = [
  { id: "midjourney", tool: "Midjourney", category: "Image", description: "Premium AI image generation with cinematic quality.", discount: "20% OFF", code: "AIDISC20", url: "https://www.midjourney.com", lastVerified: "2026-04-28" },
  { id: "chatgpt-plus", tool: "ChatGPT Plus", category: "Chat", description: "GPT-5 access, advanced data analysis, and priority speed.", discount: "$20 CREDIT", code: "GETAI20", url: "https://chat.openai.com", lastVerified: "2026-05-01" },
  { id: "claude-pro", tool: "Claude Pro", category: "Chat", description: "Anthropic's Claude with longer context and Projects.", discount: "1 MONTH FREE", code: "CLAUDEFREE", url: "https://claude.ai", lastVerified: "2026-04-30" },
  { id: "perplexity", tool: "Perplexity Pro", category: "Search", description: "AI-powered answer engine with cited sources.", discount: "1 YEAR FREE", code: "PPLXYEAR", url: "https://perplexity.ai", lastVerified: "2026-05-02" },
  { id: "elevenlabs", tool: "ElevenLabs", category: "Audio", description: "Hyper-realistic voice cloning and dubbing.", discount: "30% OFF", code: "VOICE30", url: "https://elevenlabs.io", lastVerified: "2026-04-25" },
  { id: "runway", tool: "Runway ML", category: "Video", description: "Gen-3 text-to-video and editing suite.", discount: "25% OFF", code: "RUNWAY25", url: "https://runwayml.com", lastVerified: "2026-04-22" },
  { id: "notion-ai", tool: "Notion AI", category: "Productivity", description: "AI writing inside your Notion workspace.", discount: "2 MONTHS FREE", code: "NOTION2M", url: "https://notion.so", lastVerified: "2026-04-29" },
  { id: "github-copilot", tool: "GitHub Copilot", category: "Coding", description: "AI pair programmer right in your editor.", discount: "FREE TRIAL", code: "COPILOT30", url: "https://github.com/features/copilot", lastVerified: "2026-05-03" },
  { id: "cursor", tool: "Cursor", category: "Coding", description: "The AI-native code editor built on VS Code.", discount: "20% OFF", code: "CURSOR20", url: "https://cursor.sh", lastVerified: "2026-05-01" },
  { id: "jasper", tool: "Jasper AI", category: "Writing", description: "Marketing-focused AI content generation.", discount: "20% OFF", code: "JASPER20", url: "https://jasper.ai", lastVerified: "2026-04-18" },
  { id: "synthesia", tool: "Synthesia", category: "Video", description: "AI avatars for studio-quality video at scale.", discount: "15% OFF", code: "SYNTH15", url: "https://synthesia.io", lastVerified: "2026-04-20" },
  { id: "descript", tool: "Descript", category: "Audio", description: "Edit audio and video by editing text.", discount: "30% OFF", code: "DESCRIPT30", url: "https://descript.com", lastVerified: "2026-04-27" },
];

const REMOTE_URL = "https://raw.githubusercontent.com/zamoley/GetAIDiscounts/main/ai_deals.json";

function normalize(raw: any, idx: number): Deal {
  return {
    id: String(raw.id ?? raw.slug ?? raw.tool ?? idx).toLowerCase().replace(/\s+/g, "-"),
    tool: raw.tool ?? raw.name ?? "Unknown",
    category: raw.category,
    description: raw.description ?? raw.desc,
    discount: raw.discount ?? raw.deal ?? "DEAL",
    code: raw.code ?? raw.coupon,
    url: raw.url ?? raw.link ?? "#",
    lastVerified: raw.lastVerified ?? raw.last_verified ?? raw.verified ?? new Date().toISOString().slice(0, 10),
    logo: raw.logo,
  };
}

export async function fetchDeals(): Promise<Deal[]> {
  try {
    const res = await fetch(REMOTE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const arr = Array.isArray(data) ? data : (data.deals ?? data.tools ?? []);
    if (!arr.length) throw new Error("empty");
    return arr.map(normalize);
  } catch {
    return fallbackDeals;
  }
}
