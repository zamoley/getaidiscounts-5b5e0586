import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { createHash } from "crypto";
import { z } from "zod";


const VoteInput = z.object({
  dealId: z.string().min(1).max(120).regex(/^[a-zA-Z0-9_-]+$/),
  vote: z.enum(["worked", "broken"]),
});

export const castVote = createServerFn({ method: "POST" })
  .inputValidator((input) => VoteInput.parse(input))
  .handler(async ({ data }) => {
    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    const ua = getRequestHeader("user-agent") ?? "unknown";
    const fingerprint = createHash("sha256")
      .update(`${ip}|${ua}|${data.dealId}`)
      .digest("hex");

    const { error } = await supabaseAdmin.from("deal_votes").insert({
      deal_id: data.dealId,
      vote: data.vote,
      voter_fingerprint: fingerprint,
    });

    if (error) {
      // Unique violation = already voted
      if ((error as { code?: string }).code === "23505") {
        return { ok: false as const, reason: "already_voted" as const };
      }
      throw new Error("Failed to record vote");
    }

    const { data: rows } = await supabaseAdmin
      .from("deal_votes")
      .select("vote")
      .eq("deal_id", data.dealId);

    const counts = {
      worked: rows?.filter((r) => r.vote === "worked").length ?? 0,
      broken: rows?.filter((r) => r.vote === "broken").length ?? 0,
    };
    return { ok: true as const, counts };
  });
