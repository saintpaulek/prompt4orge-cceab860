export const heroAssets = {
  desktop: "/manus-storage/promptforge-hero-desktop_16d1d426.webp",
  mobile: "/manus-storage/promptforge-hero-mobile_964b233a.webp",
} as const;

export function getHeroAssetStyle() {
  return {
    "--hero-image-desktop": `url("${heroAssets.desktop}")`,
    "--hero-image-mobile": `url("${heroAssets.mobile}")`,
  };
}
