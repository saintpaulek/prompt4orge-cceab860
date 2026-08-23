import { ArrowDown, Download, RefreshCw, Share2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { INSTALL_PROMPT_DISMISSED_KEY, PULL_REFRESH_THRESHOLD, getInstallPromptMode, getPullRefreshLabel, isAppleMobileDevice, shouldTriggerPullRefresh, type InstallPromptMode, type PullRefreshStatus } from "@/lib/mobileAppExperience";

type DeferredInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function getScrollTop() {
  return Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop);
}

function usePullToRefresh(onRefresh: () => void) {
  const [status, setStatus] = useState<PullRefreshStatus>("idle");
  const startY = useRef<number | null>(null);
  const pullDistance = useRef(0);

  useEffect(() => {
    const reset = () => {
      startY.current = null;
      pullDistance.current = 0;
      setStatus("idle");
    };
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || getScrollTop() > 0) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button, a")) return;
      startY.current = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (startY.current === null || getScrollTop() > 0) return;
      const currentY = event.touches[0]?.clientY ?? startY.current;
      const distance = Math.max(0, currentY - startY.current);
      if (distance === 0) return;
      pullDistance.current = distance;
      event.preventDefault();
      setStatus(shouldTriggerPullRefresh(distance, true) ? "armed" : "pulling");
    };
    const onTouchEnd = () => {
      if (startY.current === null) return;
      const shouldRefresh = shouldTriggerPullRefresh(pullDistance.current, getScrollTop() <= 0);
      startY.current = null;
      pullDistance.current = 0;
      if (!shouldRefresh) {
        setStatus("idle");
        return;
      }
      setStatus("refreshing");
      window.setTimeout(onRefresh, 260);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", reset, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", reset);
    };
  }, [onRefresh]);

  return status;
}

function isStandaloneMode() {
  return window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

function readInstallDismissal() {
  try {
    return window.localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

function storeInstallDismissal() {
  try {
    window.localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, "1");
  } catch {
    // The prompt still closes when storage is unavailable.
  }
}

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<InstallPromptMode>("hidden");

  const resolveMode = useCallback((prompt: DeferredInstallPromptEvent | null) => {
    const isAppleMobile = isAppleMobileDevice(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);
    setMode(getInstallPromptMode({ isStandalone: isStandaloneMode(), isDismissed: readInstallDismissal(), hasDeferredPrompt: !!prompt, isAppleMobile }));
  }, []);

  useEffect(() => {
    resolveMode(null);
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const installEvent = event as DeferredInstallPromptEvent;
      setDeferredPrompt(installEvent);
      resolveMode(installEvent);
    };
    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setMode("hidden");
      toast.success("PromptForge installed", { description: "Open it from your home screen whenever you need a sharper brief." });
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [resolveMode]);

  const dismiss = () => {
    storeInstallDismissal();
    setMode("hidden");
  };
  const install = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setMode("hidden");
      } else {
        dismiss();
      }
    } catch {
      toast.error("Install prompt unavailable", { description: "Try opening PromptForge in your browser menu instead." });
    }
  };

  if (mode === "hidden") return null;
  return <aside className="mobile-install-prompt" role="dialog" aria-labelledby="install-prompt-title"><button className="install-dismiss" onClick={dismiss} aria-label="Dismiss install prompt"><X size={16}/></button><div className="install-icon"><Download size={18}/></div><div className="install-copy"><strong id="install-prompt-title">Keep PromptForge close.</strong>{mode === "native" ? <span>Add the workshop to your home screen for an app-like workspace.</span> : <span>In Safari, tap <Share2 size={13}/> Share, then choose “Add to Home Screen.”</span>}</div>{mode === "native" && <button className="install-action" onClick={() => void install()}>Install</button>}</aside>;
}

export default function MobileNativeControls() {
  const refreshPage = useCallback(() => window.location.reload(), []);
  const refreshStatus = usePullToRefresh(refreshPage);
  const label = getPullRefreshLabel(refreshStatus);

  return <><div className={`pull-refresh-indicator ${refreshStatus}`} role="status" aria-live="polite"><span className="pull-refresh-icon">{refreshStatus === "refreshing" ? <RefreshCw size={16}/> : <ArrowDown size={16}/>}</span><span>{label}</span>{refreshStatus === "armed" && <small>{PULL_REFRESH_THRESHOLD}px ready</small>}</div><InstallPrompt/></>;
}
