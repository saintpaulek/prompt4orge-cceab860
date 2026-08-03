import { useEffect, useState } from "react";

export const K_UNLOCK = "pf.unlocked.v2";
export const K_SAVED = "pf.saved.v2";
export const K_WELCOME = "pf.welcome.seen.v1";

export function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setV(JSON.parse(raw) as T);
    } catch {}
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v, ready]);

  return [v, setV, ready] as const;
}

export function useSavedPrompts() {
  const [saved, setSaved] = useLocal<number[]>(K_SAVED, []);
  const toggleSave = (id: number) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const remove = (id: number) => setSaved((s) => s.filter((x) => x !== id));
  return { saved, toggleSave, remove };
}

export function useUnlock() {
  const [unlocked, setUnlocked] = useLocal<boolean>(K_UNLOCK, false);
  return { unlocked, setUnlocked };
}

// ---------- unlock code (checksum) ----------
function checksum(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return chars[h % 36] + chars[(h >>> 5) % 36];
}

export function isValidUnlockCode(code: string) {
  const m = code.trim().toUpperCase().match(/^PF-([A-Z0-9]{6})-([A-Z0-9]{2})$/);
  if (!m) return false;
  return checksum(m[1]) === m[2];
}
