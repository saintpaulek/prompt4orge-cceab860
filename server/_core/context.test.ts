import { afterEach, describe, expect, it } from "vitest";
import { getSupabaseAuthUrl } from "./context";

const originalServerUrl = process.env.SUPABASE_URL;
const originalPublicUrl = process.env.VITE_SUPABASE_URL;

afterEach(() => {
  if (originalServerUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = originalServerUrl;
  if (originalPublicUrl === undefined) delete process.env.VITE_SUPABASE_URL;
  else process.env.VITE_SUPABASE_URL = originalPublicUrl;
});

describe("getSupabaseAuthUrl", () => {
  it("uses the server URL when it is available", () => {
    process.env.SUPABASE_URL = "https://server-project.supabase.co/";
    process.env.VITE_SUPABASE_URL = "https://public-project.supabase.co";
    expect(getSupabaseAuthUrl()).toBe("https://server-project.supabase.co");
  });

  it("falls back to VITE_SUPABASE_URL for a Vercel API function", () => {
    delete process.env.SUPABASE_URL;
    process.env.VITE_SUPABASE_URL = "https://rupzljrpzdfrehgvbwdt.supabase.co/";
    expect(getSupabaseAuthUrl()).toBe("https://rupzljrpzdfrehgvbwdt.supabase.co");
  });
});

