import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

export function getSystemTheme(): Theme {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveThemePreference(preference: ThemePreference, systemTheme: Theme): Theme {
  return preference === "system" ? systemTheme : preference;
}

export function readThemePreference(search: string, stored: string | null, fallback: ThemePreference): ThemePreference {
  const requested = new URLSearchParams(search).get("theme");
  if (requested === "light" || requested === "dark" || requested === "system") return requested;
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return fallback;
}

interface ThemeContextType {
  theme: Theme;
  themePreference: ThemePreference;
  setThemePreference?: (preference: ThemePreference) => void;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemePreference;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    if (switchable) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const stored = typeof window !== "undefined" ? localStorage.getItem("promptforge-theme") : null;
      return readThemePreference(search, stored, defaultTheme);
    }
    return defaultTheme;
  });
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);
  const theme = resolveThemePreference(themePreference, systemTheme);

  useEffect(() => {
    if (!switchable || themePreference !== "system" || typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = (event?: MediaQueryListEvent) => setSystemTheme(event ? (event.matches ? "dark" : "light") : getSystemTheme());
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, [switchable, themePreference]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    if (switchable) localStorage.setItem("promptforge-theme", themePreference);
  }, [theme, themePreference, switchable]);

  const setPreference = switchable ? setThemePreference : undefined;
  const toggleTheme = switchable
    ? () => setThemePreference(prev => (prev === "dark" ? "light" : prev === "light" ? "system" : "dark"))
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, themePreference, setThemePreference: setPreference, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
