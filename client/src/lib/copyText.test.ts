import { afterEach, describe, expect, it, vi } from "vitest";
import { copyText } from "./copyText";

afterEach(() => vi.unstubAllGlobals());

describe("copyText", () => {
  it("copies via the native clipboard when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await expect(copyText("Prompt output")).resolves.toBe("copied");
    expect(writeText).toHaveBeenCalledWith("Prompt output");
  });

  it("reports unavailable when neither clipboard method can run", async () => {
    vi.stubGlobal("navigator", {});
    await expect(copyText("Prompt output")).resolves.toBe("unavailable");
  });
});
