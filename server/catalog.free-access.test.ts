import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const publicContext: TrpcContext = {
  user: null,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: { clearCookie: () => undefined } as TrpcContext["res"],
};

const categories = [
  "SMM", "VA Tasks", "Customer Service", "Automation Logic", "SEO", "Email Marketing", "Sales & Copywriting", "Content Strategy", "Image Generation", "Video & Shorts", "Blogging & Articles", "Ecommerce & Product", "Freelancing & Clients", "Branding & Identity", "Ads & Paid Media", "ChatGPT Productivity", "Business & Strategy", "Education & Learning", "Personal Development", "Finance & Admin", "Banking & Fintech Engagement", "Nigeria Business Growth & WhatsApp", "Email Marketing & Sequences", "SEO & Content Optimization", "Finance, Accounting & Admin", "Personal Development & Productivity", "HR / Recruitment & People Ops", "WhatsApp / Messaging Business", "Legal / Contracts & Compliance", "Real Estate", "Agency / Client Management", "Healthcare / Wellness",
] as const;

const unchangedAboveMinimum = new Map([
  ["Ecommerce & Product", 15],
  ["Education & Learning", 15],
  ["Nigeria Business Growth & WhatsApp", 20],
  ["Email Marketing & Sequences", 10],
  ["SEO & Content Optimization", 10],
  ["Finance, Accounting & Admin", 10],
  ["Personal Development & Productivity", 10],
  ["HR / Recruitment & People Ops", 10],
  ["WhatsApp / Messaging Business", 10],
  ["Legal / Contracts & Compliance", 10],
  ["Real Estate", 10],
  ["Agency / Client Management", 10],
  ["Healthcare / Wellness", 10],
]);

describe("catalog FREE access policy", () => {
  it("provides at least 10 free prompts for every category", async () => {
    const caller = appRouter.createCaller(publicContext);
    const results = await Promise.all(categories.map(async (category) => ({ category, result: await caller.catalog.list({ category, access: "FREE", sort: "NEWEST", limit: 100, offset: 0 }) })));
    for (const { category, result } of results) {
      expect(result.total, `${category} free count`).toBeGreaterThanOrEqual(10);
      expect(result.items.every((item) => item.access === "FREE" && item.promptBody.length > 0)).toBe(true);
    }
  }, 30_000);

  it("keeps categories that already exceeded the minimum at their existing free count", async () => {
    const caller = appRouter.createCaller(publicContext);
    for (const [category, expected] of unchangedAboveMinimum) {
      const result = await caller.catalog.list({ category, access: "FREE", sort: "NEWEST", limit: 100, offset: 0 });
      expect(result.total, `${category} free count`).toBe(expected);
    }
  }, 30_000);
});
