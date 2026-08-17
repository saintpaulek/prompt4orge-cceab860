import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

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
};

const AuthContext = createContext<AuthContextValue | null>(null);

function friendlyError(message?: string) {
  if (!message) return "The workshop could not complete that request. Please try again.";
  if (/invalid login credentials/i.test(message)) return "That email and password combination is not recognized.";
  if (/email not confirmed/i.test(message)) return "Check your inbox and confirm your email before signing in.";
  if (/user already registered/i.test(message)) return "An account already exists for this email. Try signing in instead.";
  return message;
}

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => { if (mounted) { setSession(data.session); setLoading(false); } });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => { mounted = false; data.subscription.unsubscribe(); };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session, user: session?.user ?? null, loading,
    async signIn(email, password): Promise<{ error?: string }> { const { error } = await supabase.auth.signInWithPassword({ email, password }); return error ? { error: friendlyError(error.message) } : {}; },
    async signUp(email, password, displayName): Promise<{ error?: string; needsVerification?: boolean }> { const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName || undefined } } }); return error ? { error: friendlyError(error.message) } : { needsVerification: !data.session }; },
    async signInWithGoogle() { const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth` } }); return error ? { error: friendlyError(error.message) } : {}; },
    async signInWithGitHub() { const { error } = await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo: `${window.location.origin}/auth` } }); return error ? { error: friendlyError(error.message) } : {}; },
    async sendMagicLink(email) { const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth` } }); return error ? { error: friendlyError(error.message) } : {}; },
    async sendPasswordReset(email) { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` }); return error ? { error: friendlyError(error.message) } : {}; },
    async updatePassword(password) { const { error } = await supabase.auth.updateUser({ password }); return error ? { error: friendlyError(error.message) } : {}; },
    async signOut() { await supabase.auth.signOut(); },
  }), [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSupabaseAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useSupabaseAuth must be used inside SupabaseAuthProvider"); return value; }
