import { createClient } from "@supabase/supabase-js";

export const resolveSupabaseBrowserKey = (env: Record<string, unknown>) => String(env.VITE_SUPABASE_ANON_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "").trim();

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
