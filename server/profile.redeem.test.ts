import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("profile.redeemCode", () => {
  it("requires an authenticated account before redemption", async () => {
    const caller = appRouter.createCaller(context(null));
    await expect(caller.profile.redeemCode({ code: "PF-ABC1-2345" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects codes that are too short at the input boundary", async () => {
    const now = new Date();
    const caller = appRouter.createCaller(context({
      id: 42,
      openId: "signed-in-user",
      email: "member@example.com",
      name: "Member",
      loginMethod: "supabase",
      role: "user",
      isUnlocked: 0,
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    }));
    await expect(caller.profile.redeemCode({ code: "x" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
