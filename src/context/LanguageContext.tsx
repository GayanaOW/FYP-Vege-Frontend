"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getTranslations, type LanguageCode } from "@/lib/localization";
import { loadLanguage, saveLanguage } from "@/lib/storage";

type LanguageCtx = {
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  t: ReturnType<typeof getTranslations>;
};

const Ctx = createContext<LanguageCtx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("en");

  useEffect(() => {
    setLangState(loadLanguage());
  }, []);

  const setLang = (l: LanguageCode) => {
    setLangState(l);
    saveLanguage(l);
  };

  const t = useMemo(() => getTranslations(lang), [lang]);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLanguage() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
