import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { castVote } from "@/server/votes.functions";

const STORAGE_KEY = "gad_votes_v1";

function getVoted(): Record<string, "worked" | "broken"> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function setVoted(map: Record<string, "worked" | "broken">) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function VoteButtons({ dealId }: { dealId: string }) {
  const [counts, setCounts] = useState({ worked: 0, broken: 0 });
  const [myVote, setMyVote] = useState<"worked" | "broken" | null>(null);
  const [loading, setLoading] = useState<"worked" | "broken" | null>(null);

  useEffect(() => {
    setMyVote(getVoted()[dealId] ?? null);
    (async () => {
      const { data } = await supabase
        .from("deal_votes")
        .select("vote")
        .eq("deal_id", dealId);
      if (data) {
        setCounts({
          worked: data.filter((d) => d.vote === "worked").length,
          broken: data.filter((d) => d.vote === "broken").length,
        });
      }
    })();
  }, [dealId]);

  const vote = async (v: "worked" | "broken") => {
    if (myVote || loading) return;
    setLoading(v);
    try {
      const result = await castVote({ data: { dealId: dealId, vote: v } });
      if (!result.ok) {
        toast.error("You've already voted on this deal");
        const map = { ...getVoted(), [dealId]: v };
        setVoted(map);
        setMyVote(v);
        return;
      }
      const map = { ...getVoted(), [dealId]: v };
      setVoted(map);
      setMyVote(v);
      setCounts(result.counts);
      toast.success(v === "worked" ? "Thanks — marked as Worked" : "Thanks — flagged as Broken");
    } catch {
      toast.error("Couldn't record your vote");
    } finally {
      setLoading(null);
    }
  };

  const total = counts.worked + counts.broken;
  const pct = total ? Math.round((counts.worked / total) * 100) : null;

  return (
    <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => vote("worked")}
          disabled={!!myVote || !!loading}
          aria-label="Mark as worked"
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-all ${
            myVote === "worked"
              ? "bg-electric/15 text-electric ring-1 ring-electric/40"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          } ${myVote && myVote !== "worked" ? "opacity-50" : ""}`}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Worked
          <span className="font-mono">{counts.worked}</span>
        </button>
        <button
          onClick={() => vote("broken")}
          disabled={!!myVote || !!loading}
          aria-label="Mark as broken"
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-all ${
            myVote === "broken"
              ? "bg-destructive/15 text-destructive ring-1 ring-destructive/40"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          } ${myVote && myVote !== "broken" ? "opacity-50" : ""}`}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          Broken
          <span className="font-mono">{counts.broken}</span>
        </button>
      </div>
      {pct !== null && (
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {pct}% trust
        </span>
      )}
    </div>
  );
}
