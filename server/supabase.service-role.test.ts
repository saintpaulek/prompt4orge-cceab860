import { describe, expect, it } from "vitest";

describe("active Supabase service-role configuration", () => {
  it("can reach the active project admin endpoint", async () => {
    const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Active Supabase URL or service-role key is not configured");
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users?page=1&per_page=1`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    expect(response.ok, `Supabase admin endpoint returned HTTP ${response.status}`).toBe(true);
    const body = await response.json();
    expect(Array.isArray(body?.users)).toBe(true);
  }, 20_000);
});

