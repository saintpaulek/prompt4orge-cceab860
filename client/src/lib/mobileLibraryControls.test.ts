import fs from "node:fs/promises";
import { describe, expect, it } from "vitest";

const stylesheet = new URL("../index.css", import.meta.url);

describe("mobile Library visibility controls", () => {
  it("keeps the catalog filters and Re-forge action in normal document flow on mobile", async () => {
    const css = await fs.readFile(stylesheet, "utf8");

    expect(css).toMatch(/\.library-data-page \.catalog-toolbar\s*\{[^}]*position:static;[^}]*top:auto;/);
    expect(css).toMatch(/\.builder-page \.materials \.forge-button\s*\{[^}]*position:static;[^}]*bottom:auto;/);
  });
});
