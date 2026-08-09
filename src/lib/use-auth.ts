import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useLocal, K_UNLOCK } from "@/lib/store";

export type Profile = {
  id: string;
  email: string | null;
  is_unlocked: boolean;
  unlocked_at: string | null;
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, is_unlocked, unlocked_at")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.error("[useAuth] profile load failed:", error.message);
      setProfile(null);
      return;
    }
    setProfile(data);
  }, []);

  useEffect(() => {
    let alive = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      const u = data.session?.user;
      if (u) void loadProfile(u.id).finally(() => { if (alive) setLoading(false); });
      else setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) void loadProfile(s.user.id);
      else setProfile(null);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user) await loadProfile(session.user.id);
  }, [session, loadProfile]);

  return { session, user: session?.user ?? null, profile, loading, signOut, refreshProfile };
}

/**
 * Combined access state: Full Access = account profile is_unlocked (cross-device)
 * OR the legacy on-this-device unlock flag (guest / code redemptions while logged out).
 */
export function useAccess() {
  const auth = useAuth();
  const [localUnlocked, setLocalUnlocked] = useLocal<boolean>(K_UNLOCK, false);
  const unlocked = localUnlocked || auth.profile?.is_unlocked === true;
  const markUnlockedLocal = useCallback(() => setLocalUnlocked(true), [setLocalUnlocked]);
  return { ...auth, unlocked, localUnlocked, markUnlockedLocal };
}
