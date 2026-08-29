import { describe, expect, it } from "vitest";
import { LIBRARY_CATEGORIES } from "./PromptLibrary";

describe("PromptLibrary category selector", () => {
  it("lists the Nigeria Business Growth & WhatsApp flagship category exactly once", () => {
    const category = "Nigeria Business Growth & WhatsApp";

    expect(LIBRARY_CATEGORIES).toContain(category);
    expect(LIBRARY_CATEGORIES.filter(item => item === category)).toHaveLength(1);
  });

  it("contains no duplicate category selector values", () => {
    expect(new Set(LIBRARY_CATEGORIES).size).toBe(LIBRARY_CATEGORIES.length);
  });

  it("keeps the existing Banking & Fintech Engagement category available", () => {
    expect(LIBRARY_CATEGORIES).toContain("Banking & Fintech Engagement");
  });
});
