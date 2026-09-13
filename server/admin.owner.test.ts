import { describe, expect, it } from "vitest";
import { PROMPTFORGE_OWNER_EMAIL, hasPromptForgeAdminAccess, isPromptForgeOwnerEmail } from "./db";

describe("PromptForge owner identity", () => {
  it("matches the verified owner email case-insensitively", () => {
    expect(isPromptForgeOwnerEmail(PROMPTFORGE_OWNER_EMAIL)).toBe(true);
    expect(isPromptForgeOwnerEmail("  SAINTPAULEK@GMAIL.COM ")).toBe(true);
  });

  it("grants durable admin access when the stored role is stale", () => {
    expect(hasPromptForgeAdminAccess({ role: "user", email: PROMPTFORGE_OWNER_EMAIL })).toBe(true);
    expect(hasPromptForgeAdminAccess({ role: "user", email: " SAINTPAULEK@GMAIL.COM " })).toBe(true);
    expect(hasPromptForgeAdminAccess({ role: "user", email: "other@example.com" })).toBe(false);
    expect(hasPromptForgeAdminAccess(null)).toBe(false);
  });

  it("does not elevate unrelated email addresses", () => {
    expect(isPromptForgeOwnerEmail("saintpaulek+member@gmail.com")).toBe(false);
    expect(isPromptForgeOwnerEmail("owner@example.com")).toBe(false);
    expect(isPromptForgeOwnerEmail(null)).toBe(false);
  });
});

