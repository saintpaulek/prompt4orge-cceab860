import { describe, expect, it } from "vitest";
import { platformOptions, projectTypesByCategory } from "./builderOptions";

describe("Builder option catalogs", () => {
  it("provides at least ten choices for every category", () => {
    for (const [category, options] of Object.entries(platformOptions)) {
      expect(options.length, `${category} should have at least 10 options`).toBeGreaterThanOrEqual(10);
      expect(new Set(options).size, `${category} should not repeat options`).toBe(options.length);
    }
  });

  it("keeps the default Social Media platform available", () => {
    expect(platformOptions["Social Media"]).toContain("Instagram");
  });

  it("provides distinct, relevant making options by category", () => {
    const categories = Object.keys(projectTypesByCategory);
    expect(categories.length).toBeGreaterThanOrEqual(15);
    expect(new Set(categories.map(category => projectTypesByCategory[category].join("|"))).size).toBe(categories.length);
    expect(projectTypesByCategory["Social Media"]).toContain("A carousel sequence");
    expect(projectTypesByCategory["Code & Development"]).toContain("An API integration");
    expect(projectTypesByCategory["Banking & Fintech Engagement"]).toContain("A KYC onboarding sequence");
    expect(projectTypesByCategory["Banking & Fintech Engagement"]).not.toContain("A social post");
  });
});
