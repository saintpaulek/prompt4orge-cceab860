import { describe, expect, it } from "vitest";

describe("Supabase configuration", () => {
  it("accepts the configured URL and anonymous key", async () => {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;

    expect(url).toMatch(/^https:\/\//);
    expect(anonKey).toBeTruthy();

    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: anonKey as string },
    });

    expect(response.ok).toBe(true);
    const body = await response.json() as { external?: Record<string, boolean> };
    expect(body).toHaveProperty("external");
  }, 15_000);
});

describe("Supabase browser configuration", () => {
  it("accepts the browser-safe URL and anonymous key", async () => {
    const url = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

    expect(url).toMatch(/^https:\/\//);
    expect(anonKey).toBeTruthy();

    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: anonKey as string },
    });

    expect(response.ok).toBe(true);
  }, 15_000);
});
