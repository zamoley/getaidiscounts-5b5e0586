import { useState } from "react";

function domainFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function ToolLogo({
  tool,
  url,
  size = 44,
  className = "",
}: {
  tool: string;
  url: string;
  size?: number;
  className?: string;
}) {
  const domain = domainFromUrl(url);
  const [errored, setErrored] = useState(false);
  const showImg = domain && !errored;

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-electric/25 to-electric/5 ${className}`}
    >
      {showImg ? (
        <img
          src={`https://logo.clearbit.com/${domain}?size=128`}
          alt={`${tool} logo`}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onError={() => setErrored(true)}
          className="h-full w-full object-contain bg-white/95 p-1.5"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-electric font-bold">
          {tool.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
