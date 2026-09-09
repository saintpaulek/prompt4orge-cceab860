import { describe, expect, it } from "vitest";
import { hasRecoveryMarker } from "./Auth";

describe("Auth recovery marker", () => {
  it("recognizes a Supabase recovery hash", () => {
    expect(hasRecoveryMarker("https://promptforge.com.ng/auth#access_token=token&type=recovery")).toBe(true);
  });

  it("recognizes a recovery query parameter", () => {
    expect(hasRecoveryMarker("https://promptforge.com.ng/auth?type=recovery")).toBe(true);
  });

  it("does not treat an ordinary magic-link session as password recovery", () => {
    expect(hasRecoveryMarker("https://promptforge.com.ng/auth#access_token=token&type=magiclink")).toBe(false);
  });
});
