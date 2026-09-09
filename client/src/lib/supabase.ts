import { createClient } from "@supabase/supabase-js";

export const resolveSupabaseBrowserKey = (env: Record<string, unknown>) => String(env.VITE_SUPABASE_ANON_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "").trim();

const PAID_DOMAIN_ORIGIN = "https://www.promptforge.com.ng";
const RECOVERY_STORAGE_KEY = "promptforge_recovery_pending";

function isRecoveryHref(href: string) {
  try {
    const url = new URL(href, "https://promptforge.local");
    const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
    return hash.get("type") === "recovery" || url.searchParams.get("type") === "recovery" || url.searchParams.get("flow") === "recovery";
  } catch {
    return false;
  }
}

if (typeof window !== "undefined" && isRecoveryHref(window.location.href)) {
  window.sessionStorage.setItem(RECOVERY_STORAGE_KEY, "1");
}

export function isRecoveryPending() {
  return typeof window !== "undefined" && window.sessionStorage.getItem(RECOVERY_STORAGE_KEY) === "1";
}

export function clearRecoveryPending() {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(RECOVERY_STORAGE_KEY);
}

export function getSupabaseAuthRedirectUrl(origin: string) {
  const normalizedOrigin = origin.replace(/\/+$/, "");
  try {
    const hostname = new URL(normalizedOrigin).hostname.toLowerCase();
    if (hostname === "prompt4orge.lovable.app" || hostname === "promptforge.com.ng") {
      return `${PAID_DOMAIN_ORIGIN}/auth`;
    }
  } catch {
    // Keep the original value below so malformed development origins still
    // produce a deterministic redirect instead of throwing during auth UI.
  }
  return `${normalizedOrigin}/auth`;
}

export function getSupabasePasswordRecoveryRedirectUrl(origin: string) {
  const redirect = getSupabaseAuthRedirectUrl(origin);
  return `${redirect}${redirect.includes("?") ? "&" : "?"}flow=recovery`;
}

const rawSupabaseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const supabaseUrl = rawSupabaseUrl.replace(/\/+$/, "");
const supabaseAnonKey = resolveSupabaseBrowserKey(import.meta.env);

export const supabaseConfig = {
  configured: Boolean(supabaseUrl && supabaseAnonKey),
  hasUrl: Boolean(supabaseUrl),
  hasAnonKey: Boolean(supabaseAnonKey),
  keySource: import.meta.env.VITE_SUPABASE_ANON_KEY ? "anon" : import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "publishable" : "missing",
  origin: typeof window !== "undefined" ? window.location.origin : "server",
  urlHost: (() => {
    try { return supabaseUrl ? new URL(supabaseUrl).host : "missing"; } catch { return "invalid"; }
  })(),
};

if (!supabaseConfig.configured) {
  console.error("[Supabase] Browser client is not configured", { ...supabaseConfig });
} else if (typeof window !== "undefined") {
  console.info("[Supabase] Browser client configured", { ...supabaseConfig });
}

const safeUrl = supabaseUrl || "https://placeholder.supabase.co";
const safeAnonKey = supabaseAnonKey || "placeholder-anon-key";

export const supabase = createClient(safeUrl, safeAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export type SupabaseProviderStatus = { google: boolean; github: boolean; email: boolean };

export async function getSupabaseProviderStatus(): Promise<SupabaseProviderStatus> {
  if (!supabaseConfig.configured) return { google: false, github: false, email: false };
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, { headers: { apikey: supabaseAnonKey } });
    if (!response.ok) throw new Error(`settings:${response.status}`);
    const body = await response.json() as { external?: Record<string, boolean> };
    return { google: body.external?.google === true, github: body.external?.github === true, email: true };
  } catch (error) {
    console.warn("[Supabase] Provider capability check failed", { message: error instanceof Error ? error.message : String(error), ...supabaseConfig });
    return { google: false, github: false, email: true };
  }
}
