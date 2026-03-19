import en from "@/locales/en.json";
import si from "@/locales/si.json";

export type LanguageCode = "en" | "si";

export function getTranslations(lang: LanguageCode) {
  return lang === "si" ? si : en;
}
