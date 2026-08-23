import { describe, expect, it } from "vitest";
import { readThemePreference, resolveThemePreference } from "./ThemeContext";

describe("ThemeContext preference helpers", () => {
  it("accepts explicit URL theme overrides including system", () => {
    expect(readThemePreference("?theme=system", "dark", "light")).toBe("system");
    expect(readThemePreference("?theme=light", "dark", "system")).toBe("light");
    expect(readThemePreference("?theme=invalid", "dark", "system")).toBe("dark");
  });

  it("resolves System to the current OS theme while preserving explicit modes", () => {
    expect(resolveThemePreference("system", "dark")).toBe("dark");
    expect(resolveThemePreference("system", "light")).toBe("light");
    expect(resolveThemePreference("dark", "light")).toBe("dark");
    expect(resolveThemePreference("light", "dark")).toBe("light");
  });
});
