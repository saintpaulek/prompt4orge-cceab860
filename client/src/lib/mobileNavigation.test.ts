import { describe, expect, it } from "vitest";
import { getMobileNavActiveItem, mobileNavTooltips } from "./mobileNavigation";

describe("getMobileNavActiveItem", () => {
  it("marks the dedicated library and pricing destinations active", () => {
    expect(getMobileNavActiveItem("/library")).toBe("library");
    expect(getMobileNavActiveItem("/pricing")).toBe("access");
  });

  it("keeps member routes grouped under account", () => {
    expect(getMobileNavActiveItem("/auth")).toBe("account");
    expect(getMobileNavActiveItem("/account")).toBe("account");
    expect(getMobileNavActiveItem("/admin/unlocks")).toBe("account");
  });

  it("provides explanatory tooltip copy for every compact control", () => {
    expect(Object.values(mobileNavTooltips)).toHaveLength(4);
    expect(Object.values(mobileNavTooltips).every((label) => label.length > 8)).toBe(true);
  });

  it("uses Forge as the dependable return path for the builder and supporting pages", () => {
    expect(getMobileNavActiveItem("/")).toBe("forge");
    expect(getMobileNavActiveItem("/about")).toBe("forge");
    expect(getMobileNavActiveItem("/guides/prompt-engineering-basics")).toBe("forge");
  });
});
