"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "si" : "en")}
      className="rounded-lg border px-3 py-2 text-sm"
    >
      {lang === "en" ? "සිංහල" : "English"}
    </button>
  );
}
