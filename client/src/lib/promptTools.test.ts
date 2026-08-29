import { describe, expect, it } from "vitest";
import { extractPromptVariables, formatPromptExport, optimizePromptForPlatform, refinePrompt, replacePromptVariables, scorePrompt } from "./promptTools";

describe("prompt product helpers", () => {
  it("extracts unique square-bracket and moustache variables", () => {
    expect(extractPromptVariables("Write for [audience] in {{ channel }} and [audience].")).toEqual(["audience", "channel"]);
  });

  it("fills supplied variables and preserves missing values", () => {
    expect(replacePromptVariables("Write for [audience] on {{channel}}.", { audience: "new founders" })).toBe("Write for new founders on {{channel}}.");
  });

  it("scores structured prompts and returns actionable suggestions", () => {
    const result = scorePrompt("ROLE: You are an editor. TASK: Draft a brief. OUTPUT: Give steps.");
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(100);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("adds typed refinement and platform guidance", () => {
    expect(refinePrompt("Draft a launch plan.", "shorter")).toMatch(/REFINEMENT INSTRUCTION/);
    expect(optimizePromptForPlatform("Draft a launch plan.", "Claude")).toMatch(/CLAUDE/);
  });

  it("formats Notion-ready and JSON exports with detected variables", () => {
    expect(formatPromptExport("Use [audience].", "notion", "Brief").content).toMatch(/Review checklist/);
    expect(formatPromptExport("Use [audience].", "json", "Brief").content).toMatch(/audience/);
  });
});
