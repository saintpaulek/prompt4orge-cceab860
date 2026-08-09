import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Marks the signed-in user's profile as unlocked. Privileged write (service role)
 * because clients have no UPDATE grant on profiles — users can never self-grant.
 * In production this is called by the payment webhook after verifying the charge;
 * today it backs the "simulate successful payment" test flow.
 */
export const markProfileUnlocked = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_unlocked: true, unlocked_at: new Date().toISOString() })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const listAccountSaved = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("saved_prompts")
      .select("id, prompt_id, title, category, prompt_text, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { items: data ?? [] };
  });

export const savePromptToAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        promptId: z.number().int().optional(),
        title: z.string().min(1).max(300),
        category: z.string().max(120).optional(),
        promptText: z.string().min(1).max(20000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("saved_prompts")
      .insert({
        user_id: context.userId,
        prompt_id: data.promptId ?? null,
        title: data.title,
        category: data.category ?? null,
        prompt_text: data.promptText,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true as const, id: row.id };
  });

export const deleteAccountSaved = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("saved_prompts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const removeAccountSavedByPromptId = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ promptId: z.number().int() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("saved_prompts")
      .delete()
      .eq("prompt_id", data.promptId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
