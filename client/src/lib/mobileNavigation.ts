export type MobileNavItem = "forge" | "library" | "access" | "account";

export const mobileNavTooltips: Record<MobileNavItem, string> = {
  forge: "Open the prompt builder",
  library: "Browse ready-to-use prompts",
  access: "View lifetime access options",
  account: "Manage your account",
};

/**
 * Keep the compact mobile navigation aligned with PromptForge's route model.
 * Supporting pages intentionally resolve to Forge so the primary creation flow
 * remains the clear way back into the app.
 */
export function getMobileNavActiveItem(location: string): MobileNavItem {
  if (location === "/library") return "library";
  if (location === "/pricing") return "access";
  if (location === "/account" || location === "/auth" || location.startsWith("/admin/")) return "account";
  return "forge";
}
