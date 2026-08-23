import { describe, expect, it } from "vitest";
import { builderIllustrationAssets, getBuilderIllustrationSources } from "./builderAssets";

describe("Builder illustration assets", () => {
  it("provides distinct managed WebP variants for desktop and mobile", () => {
    expect(builderIllustrationAssets.desktop).toMatch(/\.webp$/);
    expect(builderIllustrationAssets.mobile).toMatch(/\.webp$/);
    expect(builderIllustrationAssets.desktop).not.toBe(builderIllustrationAssets.mobile);
    expect(getBuilderIllustrationSources().mobile).toBe(builderIllustrationAssets.mobile);
  });
});
