import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { hreflangLinks, canonicalFor } from "@/i18n/seo";

export const Route = createFileRoute("/{-$locale}/contact")({
  head: ({ params }) => {
    const loc = (params as { locale?: string }).locale ?? "en";
    return {
      links: [
        ...hreflangLinks("/contact"),
        { rel: "canonical", href: canonicalFor(loc, "/contact") },
      ],
      meta: [
        { title: "Contact | GetAIDiscounts" },
        {
          name: "description",
          content:
            "Submit an AI tool, request a deal, or reach our support team. We read every message.",
        },
        { property: "og:title", content: "Contact | GetAIDiscounts" },
        {
          property: "og:description",
          content:
            "Submit an AI tool, request a deal, or reach our support team.",
        },
        { property: "og:locale", content: loc },
        { property: "og:url", content: canonicalFor(loc, "/contact") },
      ],
    };
  },
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(160),
  message: z.string().trim().min(5, "Message is too short").max(2000),
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, subject, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("deal_requests").insert({
      tool_name: `[Contact] ${parsed.data.subject}`,
      email: parsed.data.email.toLowerCase(),
      notes: `From: ${parsed.data.name}\n\n${parsed.data.message}`,
    });
    setLoading(false);
    if (error) {
      toast.error("Couldn't send. Try again or email hello@getaidiscounts.com.");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setName(""); setEmail(""); setSubject(""); setMessage("");
  };

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <article className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-3 text-muted-foreground">
          Submitting an AI tool, reporting a broken code, or just saying hi? Drop
          us a line — or email{" "}
          <a href="mailto:hello@getaidiscounts.com" className="text-electric hover:underline">
            hello@getaidiscounts.com
          </a>
          .
        </p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="c-name">Your name</Label>
            <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c-email">Email</Label>
            <Input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c-subject">Subject</Label>
            <Input
              id="c-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={160}
              placeholder="Tool submission, support, partnership…"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c-message">Message</Label>
            <Textarea id="c-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} maxLength={2000} required />
          </div>
          <div>
            <Button type="submit" disabled={loading} className="bg-electric text-electric-foreground hover:bg-electric-glow">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send message"}
            </Button>
          </div>
        </form>
      </article>
      <SiteFooter />
    </main>
  );
}
