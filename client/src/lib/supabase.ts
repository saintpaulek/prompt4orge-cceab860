import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const supabaseUrl = rawSupabaseUrl.replace(/\/+$/, "");
const supabaseAnonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

export const supabaseConfig = {
  configured: Boolean(supabaseUrl && supabaseAnonKey),
  hasUrl: Boolean(supabaseUrl),
  hasAnonKey: Boolean(supabaseAnonKey),
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
