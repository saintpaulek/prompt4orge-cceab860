import { describe, expect, it } from "vitest";

const ownerEmail = "saintpaulek@gmail.com";

describe("owner password recovery credential", () => {
  it("is accepted by the configured Supabase password grant", async () => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const password = process.env.PROMPTFORGE_OWNER_NEW_PASSWORD;

    if (!supabaseUrl || !anonKey || !password) {
      throw new Error("Supabase public configuration or recovery password is not configured");
    }

    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: ownerEmail, password }),
    });

    const body = await response.json().catch(() => ({}));
    expect(response.ok, typeof body?.msg === "string" ? body.msg : `HTTP ${response.status}`).toBe(true);
    expect(typeof body?.access_token).toBe("string");
    expect(body?.user?.email?.toLowerCase()).toBe(ownerEmail);
  }, 20_000);
});

