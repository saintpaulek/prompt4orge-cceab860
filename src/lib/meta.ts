export const SITE_URL = "https://www.promptforge.com.ng";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const SITE_TITLE = "PromptForge — Craft production-ready AI prompts in 60 seconds";
export const SITE_DESC =
  "Pick a category, platform, tone & goal, then copy a ready-to-use AI prompt. 1,000+ expert prompts + live prompt builder.";

/** Standard head() for a public leaf route: self-referencing canonical + og:url + branded OG image. */
export function leafHead(path: string, title: string, description: string) {
  const url = `${SITE_URL}${path}`;
  return () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: url }],
  });
}
