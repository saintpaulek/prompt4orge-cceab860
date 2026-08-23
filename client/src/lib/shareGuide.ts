export type GuideShareResult = "shared" | "copied" | "unavailable";

export function getGuideSharePayload(title: string, pathname: string) {
  const origin = typeof window === "undefined" ? "https://www.promptforge.com.ng" : window.location.origin;
  return { title, text: `${title} — PromptForge`, url: `${origin}${pathname}` };
}

export async function shareGuide(title: string, pathname: string): Promise<GuideShareResult> {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "unavailable";
  const payload = getGuideSharePayload(title, pathname);
  if (typeof navigator.share === "function") {
    try { await navigator.share(payload); return "shared"; } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "unavailable";
    }
  }
  if (typeof navigator.clipboard?.writeText === "function") {
    try { await navigator.clipboard.writeText(payload.url); return "copied"; } catch { return "unavailable"; }
  }
  return "unavailable";
}
