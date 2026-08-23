import { afterEach, describe, expect, it, vi } from "vitest";
import { getGuideSharePayload, shareGuide } from "./shareGuide";

afterEach(() => vi.unstubAllGlobals());

describe("guide sharing", () => {
  it("builds an origin-aware share payload", () => {
    vi.stubGlobal("window", { location: { origin: "https://www.promptforge.com.ng" } });
    expect(getGuideSharePayload("Guide title", "/guides/example")).toEqual({ title: "Guide title", text: "Guide title — PromptForge", url: "https://www.promptforge.com.ng/guides/example" });
  });

  it("prefers native share when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("window", { location: { origin: "https://www.promptforge.com.ng" } });
    vi.stubGlobal("navigator", { share });
    await expect(shareGuide("Guide title", "/guides/example")).resolves.toBe("shared");
    expect(share).toHaveBeenCalledOnce();
  });

  it("falls back to copying the URL", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("window", { location: { origin: "https://www.promptforge.com.ng" } });
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await expect(shareGuide("Guide title", "/guides/example")).resolves.toBe("copied");
    expect(writeText).toHaveBeenCalledWith("https://www.promptforge.com.ng/guides/example");
  });
});
