import { describe, expect, it } from "vitest";
import { platformOptions } from "./builderOptions";

describe("Builder platform options", () => {
  it("provides at least ten choices for every category", () => {
    for (const [category, options] of Object.entries(platformOptions)) {
      expect(options.length, `${category} should have at least 10 options`).toBeGreaterThanOrEqual(10);
      expect(new Set(options).size, `${category} should not repeat options`).toBe(options.length);
    }
  });

  it("keeps the default Social Media platform available", () => {
    expect(platformOptions["Social Media"]).toContain("Instagram");
  });
});
