import { describe, expect, it } from "vitest";
import { getHeroAssetStyle, heroAssets } from "./heroAssets";

describe("responsive hero artwork", () => {
  it("uses distinct managed WebP assets for desktop and mobile delivery", () => {
    expect(heroAssets.desktop).toMatch(/\.webp$/);
    expect(heroAssets.mobile).toMatch(/\.webp$/);
    expect(heroAssets.desktop).not.toBe(heroAssets.mobile);
    expect(getHeroAssetStyle()["--hero-image-mobile"]).toContain(heroAssets.mobile);
  });
});
