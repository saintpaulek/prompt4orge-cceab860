import { describe, expect, it } from "vitest";
import { getFullAccessTooltip, hasFullAccess } from "./accessStatus";

describe("access navigation status", () => {
  it("shows full access only for a persisted unlocked account", () => {
    expect(hasFullAccess(1)).toBe(true);
    expect(hasFullAccess(true)).toBe(true);
    expect(hasFullAccess(0)).toBe(false);
    expect(hasFullAccess(undefined)).toBe(false);
  });

  it("creates a safe Full access tooltip without exposing the unlock code", () => {
    expect(getFullAccessTooltip(new Date("2026-08-23T00:00:00.000Z"))).toContain("Aug 23, 2026");
    expect(getFullAccessTooltip()).toBe("Lifetime access is active. Open Account settings.");
  });
});
