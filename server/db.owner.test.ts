import { describe, expect, it } from "vitest";
import { isPromptForgeOwnerEmail, PROMPTFORGE_OWNER_EMAIL, UNLOCK_CODE_PATTERN, makeUnlockCode } from "./db";

describe("PromptForge owner access rules", () => {
  it("recognizes the confirmed owner email case-insensitively and trims whitespace", () => {
    expect(isPromptForgeOwnerEmail(PROMPTFORGE_OWNER_EMAIL)).toBe(true);
    expect(isPromptForgeOwnerEmail("  SAINTPAULEK@GMAIL.COM ")).toBe(true);
    expect(isPromptForgeOwnerEmail("another@example.com")).toBe(false);
    expect(isPromptForgeOwnerEmail(null)).toBe(false);
  });

  it("keeps generated unlock codes in the protected admin format", () => {
    expect(UNLOCK_CODE_PATTERN.test(makeUnlockCode())).toBe(true);
  });
});

