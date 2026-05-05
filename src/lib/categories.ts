import type { CategoryConfig } from "@/components/CategoryPage";

const YEAR = new Date().getFullYear();

export const CATEGORIES: Record<string, CategoryConfig> = {
  video: {
    slug: "video",
    label: "Video AI",
    h1: `Best Video AI Promo Codes ${YEAR}`,
    intro: `Verified discounts on the top AI video generators, editors and avatar tools. Updated daily by the GetAIDiscounts team.`,
    matches: ["Video"],
    keywords: ["video", "runway", "synthesia", "sora", "pika", "luma"],
  },
  voice: {
    slug: "voice",
    label: "Voice AI",
    h1: `Best Voice AI Promo Codes ${YEAR}`,
    intro: `Save on the leading AI voice cloning, text-to-speech and dubbing platforms. All deals hand-checked.`,
    matches: ["Audio", "Voice"],
    keywords: ["voice", "elevenlabs", "speech", "tts", "dubbing", "audio"],
  },
  writing: {
    slug: "writing",
    label: "Writing AI",
    h1: `Best Writing AI Promo Codes ${YEAR}`,
    intro: `Exclusive discounts on AI writing assistants, copywriters and editors built for marketers and creators.`,
    matches: ["Writing"],
    keywords: ["writing", "copy", "jasper", "grammarly", "writer", "content"],
  },
  agents: {
    slug: "agents",
    label: "AI Agents",
    h1: `Best AI Agent Promo Codes ${YEAR}`,
    intro: `Discounts on autonomous AI agents and assistants that automate research, workflows and operations.`,
    matches: ["Agents", "Chat", "Productivity"],
    keywords: ["agent", "autogpt", "assistant", "chatgpt", "claude", "perplexity", "notion"],
  },
  code: {
    slug: "code",
    label: "Code AI",
    h1: `Best Code AI Promo Codes ${YEAR}`,
    intro: `Promo codes for the best AI coding assistants, IDEs and pair-programmers used by professional developers.`,
    matches: ["Coding", "Code"],
    keywords: ["code", "copilot", "cursor", "codeium", "tabnine", "developer"],
  },
  music: {
    slug: "music",
    label: "Music AI",
    h1: `Best Music AI Promo Codes ${YEAR}`,
    intro: `Save on AI music generators, mastering tools and sound design platforms loved by producers.`,
    matches: ["Music"],
    keywords: ["music", "suno", "udio", "audio", "mastering", "soundraw"],
  },
};
