import { describe, expect, it } from "vitest";
import { absoluteCanonical, createContactFaqJsonLd, createGuideArticleJsonLd, createOrganizationJsonLd, getSeoDocument, getSeoRoute, normalizeSeoPath } from "./seo";

describe("PromptForge SEO metadata", () => {
  it("normalizes trailing slashes and query strings", () => {
    expect(normalizeSeoPath("/library/?page=2")).toBe("/library");
    expect(normalizeSeoPath("/")).toBe("/");
  });

  it("marks public pages indexable with paid-domain canonicals", () => {
    const seo = getSeoDocument("/about");
    expect(seo.indexable).toBe(true);
    expect(seo.robots).toBe("index, follow");
    expect(seo.canonical).toBe("https://www.promptforge.com.ng/about");
  });

  it("keeps auth and admin surfaces out of search", () => {
    expect(getSeoRoute("/auth").indexable).toBe(false);
    expect(getSeoDocument("/admin/unlocks").robots).toBe("noindex, nofollow");
  });

  it("uses search-intent titles and descriptions across all public pages", () => {
    expect(getSeoRoute("/").title).toContain("AI Prompt Builder");
    expect(getSeoRoute("/library").title).toContain("3,000+");
    expect(getSeoRoute("/pricing").description).toContain("₦10,000 or $10");
    expect(getSeoRoute("/about").description).toContain("reliable AI instructions");
    expect(getSeoRoute("/contact").description).toContain("email or WhatsApp");
  });

  it("marks all guide pages as indexable articles with dedicated canonicals", () => {
    const guidePaths = ["/guides/prompt-engineering-basics", "/guides/prompt-engineering-for-marketing", "/guides/evaluate-and-improve-ai-prompts", "/guides/promptforge-workflow-case-study"];
    for (const path of guidePaths) {
      const seo = getSeoDocument(path);
      expect(seo.indexable).toBe(true);
      expect(seo.ogType).toBe("article");
      expect(seo.canonical).toBe(`https://www.promptforge.com.ng${path}`);
    }
    expect(getSeoRoute("/guides/prompt-engineering-basics").title).toContain("Prompt Engineering Basics");
    expect(getSeoRoute("/guides/prompt-engineering-for-marketing").description).toContain("marketing prompts");
    expect(getSeoRoute("/guides/prompt-engineering-basics").author).toBe("PromptForge Editorial Team");
    expect(getSeoRoute("/guides/prompt-engineering-basics").published).toBe("2026-08-23");
    expect(getSeoDocument("/guides/promptforge-workflow-case-study").canonical).toBe("https://www.promptforge.com.ng/guides/promptforge-workflow-case-study");
    const previews = guidePaths.map((path) => getSeoDocument(path).ogImage);
    expect(new Set(previews).size).toBe(4);
    expect(previews.every((image) => image.includes("/manus-storage/promptforge-social-") && image.includes("-1200_"))).toBe(true);
    const twitterPreviews = guidePaths.map((path) => getSeoDocument(path).twitterImage);
    expect(new Set(twitterPreviews).size).toBe(4);
    expect(twitterPreviews.every((image) => image.includes("-640_"))).toBe(true);
    expect(getSeoDocument("/guides/prompt-engineering-basics").ogImageWidth).toBe(1280);
    expect(getSeoDocument("/").ogImageHeight).toBe(960);
    expect(createGuideArticleJsonLd("/guides/prompt-engineering-basics")?.["@type"]).toBe("Article");
  });

  it("creates accurate Organization and Contact FAQ structured data", () => {
    const organization = createOrganizationJsonLd();
    expect(organization["@type"]).toBe("Organization");
    expect(organization.email).toBe("saintpaulek@gmail.com");
    expect(organization.telephone).toBe("+2347069573528");
    const faq = createContactFaqJsonLd();
    expect(faq["@type"]).toBe("FAQPage");
    expect(faq.mainEntity).toHaveLength(4);
    expect(faq.mainEntity[0].name).toBe("How quickly will I hear back?");
  });

  it("uses the paid domain for absolute canonical URLs", () => {
    expect(absoluteCanonical("/")).toBe("https://www.promptforge.com.ng/");
    expect(absoluteCanonical("/contact")).toBe("https://www.promptforge.com.ng/contact");
  });
});
