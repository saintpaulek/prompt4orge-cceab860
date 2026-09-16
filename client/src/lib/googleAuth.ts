export const GOOGLE_AUTH_PENDING_KEY = "promptforge_google_auth_pending";

export type GoogleProfileUser = {
  user_metadata?: Record<string, unknown> | null;
};

export function markGoogleAuthPending(storage?: Storage | null) {
  const target = storage ?? (typeof window !== "undefined" ? window.sessionStorage : null);
  target?.setItem(GOOGLE_AUTH_PENDING_KEY, "1");
}

export function consumeGoogleAuthPending(storage?: Storage | null) {
  const target = storage ?? (typeof window !== "undefined" ? window.sessionStorage : null);
  if (!target || target.getItem(GOOGLE_AUTH_PENDING_KEY) !== "1") return false;
  target.removeItem(GOOGLE_AUTH_PENDING_KEY);
  return true;
}

export function getGoogleAvatarUrl(user?: GoogleProfileUser | null) {
  const metadata = user?.user_metadata;
  if (!metadata) return undefined;
  const candidates = [metadata.avatar_url, metadata.picture, metadata.avatarUrl];
  const avatar = candidates.find(value => typeof value === "string" && /^https?:\/\//i.test(value));
  return typeof avatar === "string" ? avatar : undefined;
}

export function getGooglePostAuthPath() {
  return "/account";
}
