export function smartLink(toolUrl: string) {
  return `/go?url=${encodeURIComponent(toolUrl)}`;
}

export async function copyAndGo(code: string | undefined, toolUrl: string) {
  if (code) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {}
  }
  window.location.href = smartLink(toolUrl);
}
