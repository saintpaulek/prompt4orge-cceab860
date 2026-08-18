import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(role: "admin" | "user"): TrpcContext {
  const now = new Date();
  return {
    user: { id: 7, openId: `${role}-tester`, email: `${role}@example.com`, name: role, loginMethod: "supabase", role, isUnlocked: role === "admin" ? 1 : 0, createdAt: now, updatedAt: now, lastSignedIn: now },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("admin.unlocks", () => {
  it("rejects non-admin users before reaching the database", async () => {
    const caller = appRouter.createCaller(context("user"));
    await expect(caller.admin.unlocks.list({ limit: 10 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects invalid batch sizes", async () => {
    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.admin.unlocks.generate({ count: 51 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
