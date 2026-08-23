import { describe, expect, it } from "vitest";
import { hasFullAccess } from "./accessStatus";

describe("access navigation status", () => {
  it("shows full access only for a persisted unlocked account", () => {
    expect(hasFullAccess(1)).toBe(true);
    expect(hasFullAccess(true)).toBe(true);
    expect(hasFullAccess(0)).toBe(false);
    expect(hasFullAccess(undefined)).toBe(false);
  });
});
