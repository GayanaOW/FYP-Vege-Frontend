export type ThemeCode = "light" | "dark" | "soft";

const KEY = "importveg_theme";

export function saveTheme(theme: ThemeCode) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, theme);
}

export function loadTheme(): ThemeCode {
  if (typeof window === "undefined") return "light";
  const v = localStorage.getItem(KEY);
  return v === "dark" || v === "soft" ? v : "light";
}
