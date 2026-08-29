import { describe, expect, it } from "vitest";
import { newCategorySafetyNotes, platformOptions, projectTypesByCategory } from "./builderOptions";
import expansion from "../../../data/promptforge-expansion-2026-08-29.json";

const newCategories = [
  "Email Marketing & Sequences",
  "SEO & Content Optimization",
  "Finance, Accounting & Admin",
  "Education & Learning",
  "Personal Development & Productivity",
  "HR / Recruitment & People Ops",
  "Ecommerce & Product",
  "WhatsApp / Messaging Business",
  "Legal / Contracts & Compliance",
  "Real Estate",
  "Agency / Client Management",
  "Healthcare / Wellness",
];

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
    expect(categories.length).toBeGreaterThanOrEqual(25);
    expect(new Set(categories.map(category => projectTypesByCategory[category].join("|"))).size).toBe(categories.length);
    expect(projectTypesByCategory["Social Media"]).toContain("A carousel sequence");
    expect(projectTypesByCategory["Code & Development"]).toContain("An API integration");
    expect(projectTypesByCategory["Banking & Fintech Engagement"]).toContain("A KYC onboarding sequence");
    expect(projectTypesByCategory["Banking & Fintech Engagement"]).not.toContain("A social post");
  });

  it("provides six project types and at least ten platforms for every requested category", () => {
    for (const category of newCategories) {
      expect(projectTypesByCategory[category]).toHaveLength(6);
      expect(platformOptions[category].length).toBeGreaterThanOrEqual(10);
    }
  });

  it("keeps regulated-category safety notes explicit", () => {
    expect(newCategorySafetyNotes["Legal / Contracts & Compliance"]).toMatch(/not legal advice/i);
    expect(newCategorySafetyNotes["Healthcare / Wellness"]).toMatch(/non-diagnostic/i);
    expect(newCategorySafetyNotes["Finance, Accounting & Admin"]).toMatch(/confidential/i);
    expect(newCategorySafetyNotes["WhatsApp / Messaging Business"]).toMatch(/opt-out/i);
  });

  it("contains 60 records per new category with 10 FREE and 50 LOCKED", () => {
    expect(expansion).toHaveLength(720);
    for (const category of newCategories) {
      const rows = expansion.filter((row) => row.category === category);
      expect(rows).toHaveLength(60);
      expect(rows.filter((row) => row.access === "FREE")).toHaveLength(10);
      expect(rows.filter((row) => row.access === "LOCKED")).toHaveLength(50);
      expect(new Set(rows.map((row) => row.id)).size).toBe(60);
      expect(rows.every((row) => /ROLE:|TASK:|OUTPUT:/.test(row.prompt))).toBe(true);
    }
  });
});
