import { describe, expect, it } from "vitest";
import { makeUnlockCode, UNLOCK_CODE_PATTERN } from "./db";

describe("unlock-code generation", () => {
  it("generates uppercase, six-plus-six hexadecimal codes with the PF prefix", () => {
    const codes = Array.from({ length: 25 }, () => makeUnlockCode());

    expect(codes.every(code => UNLOCK_CODE_PATTERN.test(code))).toBe(true);
    expect(codes.every(code => code === code.toUpperCase())).toBe(true);
    expect(new Set(codes).size).toBe(codes.length);
  });
});
