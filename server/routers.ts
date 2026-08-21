import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { countPrompts, createSavedPrompt, createUnlockCodes, deleteSavedPrompt, getUserById, listPrompts, listSavedPrompts, listUnlockCodes, redeemUnlockCode, setSavedPromptFavorite, updateUserProfile } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure.input(z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(254), subject: z.string().trim().min(3).max(180), message: z.string().trim().min(10).max(5000) })).mutation(async ({ input }) => {
      const delivered = await notifyOwner({
        title: `PromptForge contact: ${input.subject}`,
        content: `From: ${input.name} <${input.email}>\\n\\n${input.message}`,
      });
      if (!delivered) throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "We could not deliver your message right now. Please email saintpaulek@gmail.com directly." });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    list: publicProcedure.input(z.object({ search: z.string().optional(), category: z.string().optional(), access: z.enum(["ALL", "FREE", "LOCKED"]).default("ALL"), sort: z.enum(["NEWEST", "OLDEST", "POPULAR"]).default("NEWEST"), limit: z.number().int().min(1).max(100).default(60), offset: z.number().int().min(0).default(0) })).query(async ({ ctx, input }) => {
      const [items, total] = await Promise.all([listPrompts(input, ctx.user ?? undefined), countPrompts(input)]);
      return { items, total };
    }),
  }),
  profile: router({
    me: protectedProcedure.query(({ ctx }) => getUserById(ctx.user.id)),
    update: protectedProcedure.input(z.object({ name: z.string().min(1).max(120) })).mutation(async ({ ctx, input }) => { await updateUserProfile(ctx.user.id, input.name); return getUserById(ctx.user.id); }),
    redeemCode: protectedProcedure.input(z.object({ code: z.string().min(4).max(80) })).mutation(({ ctx, input }) => redeemUnlockCode(ctx.user.id, input.code)),
  }),
  admin: router({
    unlocks: router({
      list: adminProcedure.input(z.object({ limit: z.number().int().min(1).max(200).default(100) }).optional()).query(({ input }) => listUnlockCodes(input?.limit ?? 100)),
      generate: adminProcedure.input(z.object({ count: z.number().int().min(1).max(50).default(1) })).mutation(async ({ input }) => ({ codes: await createUnlockCodes(input.count) })),
    }),
  }),
  prompts: router({
    list: protectedProcedure.query(({ ctx }) => listSavedPrompts(ctx.user.id)),
    create: protectedProcedure.input(z.object({ title: z.string().min(1).max(255), category: z.string().min(1).max(120), content: z.string().min(1) })).mutation(({ ctx, input }) => createSavedPrompt({ userId: ctx.user.id, title: input.title, category: input.category, content: input.content })),
    remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => deleteSavedPrompt(ctx.user.id, input.id)),
    favorite: protectedProcedure.input(z.object({ id: z.number().int().positive(), isFavorite: z.boolean() })).mutation(({ ctx, input }) => setSavedPromptFavorite(ctx.user.id, input.id, input.isFavorite ? 1 : 0)),
  }),
});

export type AppRouter = typeof appRouter;
