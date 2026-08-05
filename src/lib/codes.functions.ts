import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// TEMPORARY admin password — change this string to rotate access to /admin/codes
const ADMIN_PASSWORD = "promptforge-admin-2026";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function newCode() {
  const block = (n: number) =>
    Array.from({ length: n }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
  return `PF-${block(4)}-${block(4)}`;
}

function checkPassword(password: string) {
  if (password !== ADMIN_PASSWORD) throw new Error("Invalid admin password");
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    return { ok: true as const };
  });

export const adminListCodes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("unlock_codes")
      .select("id, code, is_used, used_at, created_at, note")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { codes: rows ?? [] };
  });

export const adminGenerateCodes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        password: z.string().min(1).max(200),
        count: z.number().int().min(1).max(100),
        note: z.string().trim().max(200).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = Array.from({ length: data.count }, () => ({
      code: newCode(),
      note: data.note && data.note.length > 0 ? data.note : null,
    }));
    const { data: inserted, error } = await supabaseAdmin
      .from("unlock_codes")
      .insert(rows)
      .select("id, code, is_used, used_at, created_at, note");
    if (error) throw new Error(error.message);
    return { codes: inserted ?? [] };
  });

export const redeemUnlockCode = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ code: z.string().trim().min(4).max(40) }).parse(d))
  .handler(async ({ data }) => {
    const code = data.code.toUpperCase().replace(/\s+/g, "");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("unlock_codes")
      .select("id, is_used")
      .eq("code", code)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return { ok: false as const, reason: "That code isn't valid. Check it and try again." };
    if (row.is_used) return { ok: false as const, reason: "That code has already been used." };
    const { error: upErr } = await supabaseAdmin
      .from("unlock_codes")
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq("id", row.id)
      .eq("is_used", false);
    if (upErr) throw new Error(upErr.message);
    return { ok: true as const };
  });
