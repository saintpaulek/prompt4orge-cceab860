import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createSavedPrompt, deleteSavedPrompt, getUserById, listSavedPrompts, redeemUnlockCode, setSavedPromptFavorite, updateUserProfile } from "./db";

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

  profile: router({
    me: protectedProcedure.query(({ ctx }) => getUserById(ctx.user.id)),
    update: protectedProcedure.input(z.object({ name: z.string().min(1).max(120) })).mutation(async ({ ctx, input }) => { await updateUserProfile(ctx.user.id, input.name); return getUserById(ctx.user.id); }),
    redeemCode: protectedProcedure.input(z.object({ code: z.string().min(4).max(80) })).mutation(async ({ ctx, input }) => ({ success: await redeemUnlockCode(ctx.user.id, input.code) })),
  }),
  prompts: router({
    list: protectedProcedure.query(({ ctx }) => listSavedPrompts(ctx.user.id)),
    create: protectedProcedure.input(z.object({ title: z.string().min(1).max(255), category: z.string().min(1).max(120), content: z.string().min(1) })).mutation(({ ctx, input }) => createSavedPrompt({ userId: ctx.user.id, title: input.title, category: input.category, content: input.content })),
    remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ ctx, input }) => deleteSavedPrompt(ctx.user.id, input.id)),
    favorite: protectedProcedure.input(z.object({ id: z.number().int().positive(), isFavorite: z.boolean() })).mutation(({ ctx, input }) => setSavedPromptFavorite(ctx.user.id, input.id, input.isFavorite ? 1 : 0)),
  }),
});

export type AppRouter = typeof appRouter;
