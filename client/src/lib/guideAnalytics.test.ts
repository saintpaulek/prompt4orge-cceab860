import { afterEach, describe, expect, it, vi } from "vitest";
import { createScrollDepthTracker, trackGuideEvent } from "./guideAnalytics";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("guide analytics", () => {
  it("uses stable, non-content event names", () => {
    const track = vi.fn();
    vi.stubGlobal("window", { umami: { track } });
    expect(trackGuideEvent("guide_interactive_copy", { guide_path: "/guides/promptforge-workflow-case-study" })).toBe(true);
    expect(track).toHaveBeenCalledWith("guide_interactive_copy", { guide_path: "/guides/promptforge-workflow-case-study" });
  });

  it("records each scroll milestone once", () => {
    const track = vi.fn();
    vi.stubGlobal("window", { umami: { track }, innerHeight: 1000, scrollY: 500 });
    vi.stubGlobal("document", { documentElement: { scrollHeight: 2000 } });
    const onScroll = createScrollDepthTracker("/guides/prompt-engineering-basics");
    onScroll();
    onScroll();
    expect(track).toHaveBeenCalledTimes(2);
    expect(track).toHaveBeenNthCalledWith(1, "guide_scroll_depth", { guide_path: "/guides/prompt-engineering-basics", depth_percent: 25 });
    expect(track).toHaveBeenNthCalledWith(2, "guide_scroll_depth", { guide_path: "/guides/prompt-engineering-basics", depth_percent: 50 });
  });
});
