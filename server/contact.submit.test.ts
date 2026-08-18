import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";

const notifyOwnerMock = vi.hoisted(() => vi.fn(async () => true));
vi.mock("./_core/notification", () => ({ notifyOwner: notifyOwnerMock }));

const caller = appRouter.createCaller({
  user: null,
  req: {} as never,
  res: {} as never,
});

describe("contact.submit", () => {
  it("rejects incomplete or invalid contact details", async () => {
    await expect(caller.contact.submit({ name: "A", email: "not-an-email", subject: "Hi", message: "Short" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(notifyOwnerMock).not.toHaveBeenCalled();
  });

  it("delivers a valid message through the owner notification channel", async () => {
    await expect(caller.contact.submit({ name: "Saint Paul", email: "visitor@example.com", subject: "Partnership idea", message: "I would like to discuss a collaboration with PromptForge." })).resolves.toEqual({ success: true });
    expect(notifyOwnerMock).toHaveBeenCalledWith({
      title: "PromptForge contact: Partnership idea",
      content: "From: Saint Paul <visitor@example.com>\\n\\nI would like to discuss a collaboration with PromptForge.",
    });
  });
});
