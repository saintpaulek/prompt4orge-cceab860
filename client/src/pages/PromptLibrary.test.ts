import { describe, expect, it } from "vitest";
import { buildLibraryTransfer, getLibraryActionLabel, LIBRARY_CATEGORIES } from "./PromptLibrary";

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

  it("restores both actions for free prompts", () => {
    expect(getLibraryActionLabel("copy", false)).toBe("Copy");
    expect(getLibraryActionLabel("builder", false)).toBe("Use in Builder");
    expect(buildLibraryTransfer({ id: "1", title: "Brief", category: "SMM", promptBody: "ROLE...", access: "FREE" })).toEqual({ title: "Brief", category: "SMM", promptBody: "ROLE..." });
  });

  it("protects locked prompt bodies until access is available", () => {
    expect(getLibraryActionLabel("copy", true)).toBe("Unlock to use");
    expect(getLibraryActionLabel("builder", true)).toBe("Unlock to use");
  });
});
