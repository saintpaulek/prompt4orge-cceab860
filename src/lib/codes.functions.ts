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
  .inputValidator((d: unknown) => z.object({ code: z.string().max(60) }).parse(d))
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; reason: string }> => {
    const code = data.code.toUpperCase().replace(/\s+/g, "");
    if (code.length < 4) {
      return { ok: false, reason: "That code looks too short. Codes look like PF-XXXX-XXXX." };
    }
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: row, error } = await supabaseAdmin
        .from("unlock_codes")
        .select("id, is_used")
        .eq("code", code)
        .maybeSingle();
      if (error) {
        console.error("[redeemUnlockCode] lookup failed", error);
        return { ok: false, reason: `We couldn't reach the code database (${error.message}). Please try again in a moment.` };
      }
      if (!row) return { ok: false, reason: "That code isn't valid. Check for typos — codes look like PF-XXXX-XXXX." };
      if (row.is_used) return { ok: false, reason: "That code has already been used. Each code works once." };

      const { data: updated, error: upErr } = await supabaseAdmin
        .from("unlock_codes")
        .update({ is_used: true, used_at: new Date().toISOString() })
        .eq("id", row.id)
        .eq("is_used", false)
        .select("id");
      if (upErr) {
        console.error("[redeemUnlockCode] update failed", upErr);
        return { ok: false, reason: `We found your code but couldn't activate it (${upErr.message}). Please try again.` };
      }
      if (!updated || updated.length === 0) {
        return { ok: false, reason: "That code was just used on another device." };
      }
      return { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[redeemUnlockCode] unexpected", msg);
      return { ok: false, reason: `Unlock service error: ${msg}` };
    }
  });

