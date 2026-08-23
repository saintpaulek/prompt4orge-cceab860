import { describe, expect, it } from "vitest";
import { getAssistantLaunchUrl } from "./Home";

describe("Builder assistant launch actions", () => {
  const prompt = "ROLE\nYou are a helpful editor.\n\nTASK\nRewrite this clearly.";

  it("builds a ChatGPT URL with an encoded prompt", () => {
    const url = getAssistantLaunchUrl("chatgpt", prompt);
    expect(url.startsWith("https://chatgpt.com/?q=")).toBe(true);
    expect(decodeURIComponent(url.split("?q=")[1])).toBe(prompt);
  });

  it("builds a Gemini URL with an encoded prompt", () => {
    const url = getAssistantLaunchUrl("gemini", prompt);
    expect(url.startsWith("https://gemini.google.com/app?prompt=")).toBe(true);
    expect(decodeURIComponent(url.split("?prompt=")[1])).toBe(prompt);
  });

  it("builds a Claude URL with an encoded prompt", () => {
    const url = getAssistantLaunchUrl("claude", prompt);
    expect(url.startsWith("https://claude.ai/new?q=")).toBe(true);
    expect(decodeURIComponent(url.split("?q=")[1])).toBe(prompt);
  });

  it("keeps assistant destinations distinct", () => {
    expect(getAssistantLaunchUrl("chatgpt", prompt)).not.toBe(getAssistantLaunchUrl("gemini", prompt));
    expect(getAssistantLaunchUrl("gemini", prompt)).not.toBe(getAssistantLaunchUrl("claude", prompt));
  });
});

export {};
