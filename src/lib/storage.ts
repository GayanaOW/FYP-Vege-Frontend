import type { LanguageCode } from "@/lib/localization";

const KEY = "importveg_lang";

export function saveLanguage(lang: LanguageCode) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, lang);
}

export function loadLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const v = localStorage.getItem(KEY);
  return v === "si" ? "si" : "en";
}
