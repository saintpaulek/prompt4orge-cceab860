import { describe, expect, it } from "vitest";
import { PULL_REFRESH_GESTURE_START, PULL_REFRESH_THRESHOLD, getInstallPromptMode, getMobileMenuAccessibility, getPullRefreshLabel, getPullRefreshState, isAppleMobileDevice, shouldCapturePullRefreshGesture, shouldTriggerPullRefresh } from "./mobileAppExperience";

describe("mobile app experience helpers", () => {
  it("arms refresh only after a top-of-page pull crosses the threshold", () => {
    expect(getPullRefreshState(36, true)).toEqual({ distance: 36, progress: 0.5, armed: false });
    expect(shouldTriggerPullRefresh(PULL_REFRESH_THRESHOLD, true)).toBe(true);
    expect(shouldTriggerPullRefresh(PULL_REFRESH_THRESHOLD + 20, false)).toBe(false);
  });

  it("caps the visual pull distance at the refresh threshold", () => {
    expect(getPullRefreshState(PULL_REFRESH_THRESHOLD + 45, true)).toEqual({ distance: PULL_REFRESH_THRESHOLD, progress: 1, armed: true });
  });

  it("does not capture ordinary short touch movements as pull-to-refresh gestures", () => {
    expect(shouldCapturePullRefreshGesture(PULL_REFRESH_GESTURE_START - 1, true)).toBe(false);
    expect(shouldCapturePullRefreshGesture(PULL_REFRESH_GESTURE_START, true)).toBe(true);
    expect(shouldCapturePullRefreshGesture(PULL_REFRESH_THRESHOLD, false)).toBe(false);
  });

  it("provides accessible navigation and refresh-feedback states for compact mobile controls", () => {
    expect(getMobileMenuAccessibility(false)).toEqual({ controls: "mobile-site-menu", expanded: false });
    expect(getMobileMenuAccessibility(true)).toEqual({ controls: "mobile-site-menu", expanded: true });
    expect(getPullRefreshLabel("idle")).toBe("Pull to refresh");
    expect(getPullRefreshLabel("pulling")).toBe("Pull to refresh");
    expect(getPullRefreshLabel("armed")).toBe("Release to refresh");
    expect(getPullRefreshLabel("refreshing")).toBe("Refreshing workshop…");
  });

  it("selects the appropriate install prompt for native, iOS, dismissed, and installed states", () => {
    expect(getInstallPromptMode({ isStandalone: false, isDismissed: false, hasDeferredPrompt: true, isAppleMobile: false })).toBe("native");
    expect(getInstallPromptMode({ isStandalone: false, isDismissed: false, hasDeferredPrompt: false, isAppleMobile: true })).toBe("ios");
    expect(getInstallPromptMode({ isStandalone: false, isDismissed: true, hasDeferredPrompt: true, isAppleMobile: true })).toBe("hidden");
    expect(getInstallPromptMode({ isStandalone: true, isDismissed: false, hasDeferredPrompt: true, isAppleMobile: true })).toBe("hidden");
  });

  it("recognizes iPhone, iPad, and iPadOS desktop-mode user agents", () => {
    expect(isAppleMobileDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)", "iPhone", 5)).toBe(true);
    expect(isAppleMobileDevice("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)", "MacIntel", 5)).toBe(true);
    expect(isAppleMobileDevice("Mozilla/5.0 (Linux; Android 15)", "Linux armv8l", 5)).toBe(false);
  });
});
