import { describe, expect, it } from "vitest";
import { getMobileNavActiveItem } from "./mobileNavigation";

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

  it("uses Forge as the dependable return path for the builder and supporting pages", () => {
    expect(getMobileNavActiveItem("/")).toBe("forge");
    expect(getMobileNavActiveItem("/about")).toBe("forge");
    expect(getMobileNavActiveItem("/guides/prompt-engineering-basics")).toBe("forge");
  });
});
