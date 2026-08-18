import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseProviderStatus, supabase, supabaseConfig, type SupabaseProviderStatus } from "@/lib/supabase";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error?: string; needsVerification?: boolean }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithGitHub: () => Promise<{ error?: string }>;
  sendMagicLink: (email: string) => Promise<{ error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ error?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  providers: SupabaseProviderStatus;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function friendlyError(message?: string) {
  if (!message) return "The workshop could not complete that request. Please try again.";
  if (/failed to fetch|network request failed|load failed|fetch failed|cors/i.test(message)) return "Connection to the authentication service failed. Check your internet connection or try again later.";
  if (/invalid login credentials/i.test(message)) return "That email and password combination is not recognized.";
  if (/email not confirmed/i.test(message)) return "Check your inbox and confirm your email before signing in.";
  if (/user already registered/i.test(message)) return "An account already exists for this email. Try signing in instead.";
  if (/provider is not enabled/i.test(message)) return "This social sign-in provider is not enabled yet. Try email/password or contact the workshop owner.";
  if (/redirect|url/i.test(message) && /not allowed|invalid|unauthorized/i.test(message)) return "This sign-in redirect is not allowed yet. Please contact the workshop owner.";
  return message;
}

const configError = () => supabaseConfig.configured ? undefined : "Connection to the authentication service is not configured. Please try again later.";

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<SupabaseProviderStatus>({ google: false, github: false, email: true });

  useEffect(() => {
    let mounted = true;
    if (!supabaseConfig.configured) { setLoading(false); return () => { mounted = false; }; }
    getSupabaseProviderStatus().then(nextProviders => { if (mounted) setProviders(nextProviders); });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) console.error("[Supabase] Session initialization failed", { message: error.message, ...supabaseConfig });
      setSession(data.session); setLoading(false);
    }).catch(error => {
      if (!mounted) return;
      console.error("[Supabase] Session initialization failed", { message: error instanceof Error ? error.message : String(error), ...supabaseConfig });
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => { mounted = false; data.subscription.unsubscribe(); };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session, user: session?.user ?? null, loading, providers,
    async signIn(email, password) { const missing = configError(); if (missing) return { error: missing }; try { const { error } = await supabase.auth.signInWithPassword({ email, password }); return error ? { error: friendlyError(error.message) } : {}; } catch (error) { return { error: friendlyError(error instanceof Error ? error.message : String(error)) }; } },
    async signUp(email, password, displayName) { const missing = configError(); if (missing) return { error: missing }; try { const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName || undefined } } }); return error ? { error: friendlyError(error.message) } : { needsVerification: !data.session }; } catch (error) { return { error: friendlyError(error instanceof Error ? error.message : String(error)) }; } },
    async signInWithGoogle() { const missing = configError(); if (missing) return { error: missing }; if (!providers.google) return { error: "Google sign-in is not enabled for this project yet. Use email/password or enable Google in Supabase Auth Providers." }; try { const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth` } }); return error ? { error: friendlyError(error.message) } : {}; } catch (error) { return { error: friendlyError(error instanceof Error ? error.message : String(error)) }; } },
    async signInWithGitHub() { const missing = configError(); if (missing) return { error: missing }; if (!providers.github) return { error: "GitHub sign-in is not enabled for this project yet. Use email/password or enable GitHub in Supabase Auth Providers." }; try { const { error } = await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo: `${window.location.origin}/auth` } }); return error ? { error: friendlyError(error.message) } : {}; } catch (error) { return { error: friendlyError(error instanceof Error ? error.message : String(error)) }; } },
    async sendMagicLink(email) { const missing = configError(); if (missing) return { error: missing }; try { const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth` } }); return error ? { error: friendlyError(error.message) } : {}; } catch (error) { return { error: friendlyError(error instanceof Error ? error.message : String(error)) }; } },
    async sendPasswordReset(email) { const missing = configError(); if (missing) return { error: missing }; try { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` }); return error ? { error: friendlyError(error.message) } : {}; } catch (error) { return { error: friendlyError(error instanceof Error ? error.message : String(error)) }; } },
    async updatePassword(password) { const missing = configError(); if (missing) return { error: missing }; try { const { error } = await supabase.auth.updateUser({ password }); return error ? { error: friendlyError(error.message) } : {}; } catch (error) { return { error: friendlyError(error instanceof Error ? error.message : String(error)) }; } },
    async signOut() { if (supabaseConfig.configured) await supabase.auth.signOut(); },
  }), [session, loading, providers]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSupabaseAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useSupabaseAuth must be used inside SupabaseAuthProvider"); return value; }
