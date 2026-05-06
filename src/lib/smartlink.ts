export function smartLink(toolUrl: string, toolName?: string) {
  const params = new URLSearchParams({ url: toolUrl });
  if (toolName) params.set("tool", toolName);
  return `/go?${params.toString()}`;
}

export async function copyAndGo(code: string | undefined, toolUrl: string) {
  if (code) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Continue to the deal even when clipboard access is unavailable.
    }
  }
  window.location.href = smartLink(toolUrl);
}
