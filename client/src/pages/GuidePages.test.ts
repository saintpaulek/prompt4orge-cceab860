import { describe, expect, it } from "vitest";
import { getGuide } from "./GuidePages";

describe("PromptForge field guides", () => {
  it("defines three distinct SEO guide pages with useful content", () => {
    const paths = [
      "/guides/prompt-engineering-basics",
      "/guides/prompt-engineering-for-marketing",
      "/guides/evaluate-and-improve-ai-prompts",
    ];
    const guides = paths.map((path) => getGuide(path));
    expect(guides.every(Boolean)).toBe(true);
    expect(new Set(guides.map((guide) => guide?.title)).size).toBe(3);
    expect(guides.every((guide) => (guide?.sections.length ?? 0) >= 3)).toBe(true);
  });

  it("includes the practical case study for related-guide discovery", () => {
    const caseStudy = getGuide("/guides/promptforge-workflow-case-study");
    expect(caseStudy?.label).toBe("PRACTICAL CASE STUDY");
    expect(caseStudy?.steps.length).toBeGreaterThanOrEqual(4);
  });

  it("returns no guide for an unknown slug", () => {
    expect(getGuide("/guides/not-a-real-guide")).toBeUndefined();
  });
});
