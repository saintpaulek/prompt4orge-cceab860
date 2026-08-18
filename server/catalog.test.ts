import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const publicContext: TrpcContext = {
  user: null,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: { clearCookie: () => undefined } as TrpcContext["res"],
};

describe("catalog.list", () => {
  it("rejects unsupported access filters", async () => {
    const caller = appRouter.createCaller(publicContext);
    await expect(caller.catalog.list({ access: "PREMIUM" as never, limit: 10, offset: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("enforces the maximum page size", async () => {
    const caller = appRouter.createCaller(publicContext);
    await expect(caller.catalog.list({ access: "ALL", limit: 101, offset: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
