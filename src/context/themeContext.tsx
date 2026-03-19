"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loadTheme, saveTheme, type ThemeCode } from "@/lib/themeStorage";

type ThemeCtx = {
  theme: ThemeCode;
  cycleTheme: () => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeCode>("light");

  useEffect(() => {
    const t = loadTheme();
    setTheme(t);
    document.documentElement.dataset.theme = t;
  }, []);

  const setAndApply = (t: ThemeCode) => {
    setTheme(t);
    saveTheme(t);
    document.documentElement.dataset.theme = t;
  };

  const cycleTheme = () => {
    // Light -> Dark -> Soft -> Light
    const next: ThemeCode =
      theme === "light" ? "dark" : theme === "dark" ? "soft" : "light";
    setAndApply(next);
  };

  return <Ctx.Provider value={{ theme, cycleTheme }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
