export type GuideAnalyticsEvent = "guide_scroll_depth" | "guide_interactive_view" | "guide_interactive_copy" | "guide_share";

type Umami = { track?: (event: string, data?: Record<string, string | number>) => void };

declare global {
  interface Window { umami?: Umami; }
}

export function trackGuideEvent(event: GuideAnalyticsEvent, data: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return false;
  window.umami?.track?.(event, data);
  return true;
}

export function createScrollDepthTracker(guidePath: string) {
  const milestones = [25, 50, 75, 90];
  const seen = new Set<number>();
  return () => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const depth = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
    for (const milestone of milestones) {
      if (depth >= milestone && !seen.has(milestone)) {
        seen.add(milestone);
        trackGuideEvent("guide_scroll_depth", { guide_path: guidePath, depth_percent: milestone });
      }
    }
  };
}
