import { describe, expect, it } from "vitest";
import { resolveSupabaseBrowserKey } from "./supabase";

describe("Supabase browser key resolution", () => {
  it("prefers the legacy anon key when both keys are present", () => {
    expect(resolveSupabaseBrowserKey({ VITE_SUPABASE_ANON_KEY: "anon", VITE_SUPABASE_PUBLISHABLE_KEY: "publishable" })).toBe("anon");
  });

  it("falls back to the production publishable key", () => {
    expect(resolveSupabaseBrowserKey({ VITE_SUPABASE_PUBLISHABLE_KEY: "publishable" })).toBe("publishable");
  });

  it("returns an empty key when neither browser key is configured", () => {
    expect(resolveSupabaseBrowserKey({})).toBe("");
  });
});
