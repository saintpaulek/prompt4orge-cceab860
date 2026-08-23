export function hasFullAccess(isUnlocked: boolean | number | undefined | null) {
  return Boolean(isUnlocked);
}

export function getFullAccessTooltip(unlockedAt?: Date | string | number | null) {
  if (!unlockedAt) return "Lifetime access is active. Open Account settings.";
  const date = new Date(unlockedAt);
  if (Number.isNaN(date.getTime())) return "Lifetime access is active. Open Account settings.";
  return `Lifetime access is active since ${new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date)}. Open Account settings.`;
}
