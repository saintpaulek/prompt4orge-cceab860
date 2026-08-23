import { describe, expect, it } from "vitest";
import { formatUnlockDate, getRedemptionCopy } from "./Account";

describe("Account redemption feedback", () => {
  it("provides distinct copy for each redemption outcome", () => {
    expect(getRedemptionCopy("success").title).toBe("Unlock code accepted.");
    expect(getRedemptionCopy("invalid").title).toBe("Invalid unlock code.");
    expect(getRedemptionCopy("already_used").title).toContain("already been used");
  });

  it("formats a persisted unlock timestamp for account history", () => {
    expect(formatUnlockDate("2026-08-21T18:00:00.000Z")).not.toBe("—");
    expect(formatUnlockDate(null)).toBe("—");
  });
});
