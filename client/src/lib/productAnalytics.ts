export type ProductAnalyticsEvent = "google_sign_in" | "prompt_copy" | "prompt_use_in_builder" | "unlock_code_batch_generated";

type AnalyticsWindow = Window & {
  gtag?: (command: "event", eventName: string, params?: Record<string, string | number | boolean>) => void;
  umami?: { track?: (event: string, data?: Record<string, string | number | boolean>) => void };
};

export function trackProductEvent(event: ProductAnalyticsEvent, data: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return false;
  const target = window as AnalyticsWindow;
  target.gtag?.("event", event, data);
  target.umami?.track?.(event, data);
  return true;
}
