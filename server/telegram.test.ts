import { describe, expect, it } from "vitest";
import { telegramInternals } from "./telegram";

describe("Telegram webhook security", () => {
  it("accepts the exact secret and rejects missing or mismatched values", () => {
    expect(telegramInternals.isValidSecret("test-secret", "test-secret")).toBe(true);
    expect(telegramInternals.isValidSecret("wrong", "test-secret")).toBe(false);
    expect(telegramInternals.isValidSecret(undefined, "test-secret")).toBe(false);
  });

  it("splits long Telegram messages below the platform limit", () => {
    const chunks = telegramInternals.splitMessage("x".repeat(8000));
    expect(chunks).toHaveLength(3);
    expect(chunks.every(chunk => chunk.length <= 3900)).toBe(true);
    expect(chunks.join("")).toHaveLength(8000);
  });
});
