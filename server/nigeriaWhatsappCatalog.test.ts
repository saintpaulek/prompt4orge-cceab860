import fs from "node:fs/promises";
import { describe, expect, it } from "vitest";

const catalogPath = new URL("../data/nigeria-business-growth-whatsapp.json", import.meta.url);

describe("Nigeria Business Growth & WhatsApp flagship catalog", () => {
  it("contains 150 unique, structured prompts with the selected 20/130 access split", async () => {
    const rows = JSON.parse(await fs.readFile(catalogPath, "utf8"));

    expect(rows).toHaveLength(150);
    expect(rows.filter((row: { access: string }) => row.access === "FREE")).toHaveLength(20);
    expect(rows.filter((row: { access: string }) => row.access === "LOCKED")).toHaveLength(130);
    expect(new Set(rows.map((row: { id: string }) => row.id)).size).toBe(150);
    expect(new Set(rows.map((row: { title: string }) => row.title.toLowerCase())).size).toBe(150);
    expect(rows.every((row: { category: string }) => row.category === "Nigeria Business Growth & WhatsApp")).toBe(true);
    expect(rows.every((row: { prompt: string }) => row.prompt.includes("ROLE:") && row.prompt.includes("TASK:") && row.prompt.includes("OUTPUT:"))).toBe(true);
  });
});
