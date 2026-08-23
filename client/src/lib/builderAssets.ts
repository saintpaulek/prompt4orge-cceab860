export const builderIllustrationAssets = {
  desktop: "/manus-storage/promptforge-builder-illustration-desktop_1bdd6b30.webp",
  mobile: "/manus-storage/promptforge-builder-illustration-mobile_ecd23145.webp",
} as const;

export function getBuilderIllustrationSources() {
  return {
    desktop: builderIllustrationAssets.desktop,
    mobile: builderIllustrationAssets.mobile,
  };
}
