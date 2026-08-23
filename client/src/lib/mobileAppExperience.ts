export const PULL_REFRESH_THRESHOLD = 72;
export const INSTALL_PROMPT_DISMISSED_KEY = "promptforge-install-prompt-dismissed";

export type InstallPromptMode = "hidden" | "native" | "ios";
export type PullRefreshStatus = "idle" | "pulling" | "armed" | "refreshing";

export function getMobileMenuAccessibility(isOpen: boolean) {
  return {
    controls: "mobile-site-menu",
    expanded: isOpen,
  } as const;
}

export function getPullRefreshLabel(status: PullRefreshStatus) {
  if (status === "refreshing") return "Refreshing workshop…";
  if (status === "armed") return "Release to refresh";
  return "Pull to refresh";
}

export function getPullRefreshState(distance: number, isAtTop: boolean) {
  const normalizedDistance = Math.max(0, Math.min(distance, PULL_REFRESH_THRESHOLD));
  const progress = isAtTop ? normalizedDistance / PULL_REFRESH_THRESHOLD : 0;

  return {
    distance: normalizedDistance,
    progress,
    armed: isAtTop && normalizedDistance >= PULL_REFRESH_THRESHOLD,
  };
}

export function shouldTriggerPullRefresh(distance: number, isAtTop: boolean) {
  return getPullRefreshState(distance, isAtTop).armed;
}

export function getInstallPromptMode({
  isStandalone,
  isDismissed,
  hasDeferredPrompt,
  isAppleMobile,
}: {
  isStandalone: boolean;
  isDismissed: boolean;
  hasDeferredPrompt: boolean;
  isAppleMobile: boolean;
}): InstallPromptMode {
  if (isStandalone || isDismissed) return "hidden";
  if (hasDeferredPrompt) return "native";
  return isAppleMobile ? "ios" : "hidden";
}

export function isAppleMobileDevice(userAgent: string, platform: string, maxTouchPoints: number) {
  return /iPad|iPhone|iPod/i.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1);
}
