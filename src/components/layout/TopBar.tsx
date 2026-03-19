"use client";

import LanguageToggle from "@/components/layout/LanguageToggle";
import ThemeToggle from "@/components/layout/themeToggle";
import { useLanguage } from "@/context/LanguageContext";

export default function TopBar() {
  const { t } = useLanguage();

  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center font-bold text-[var(--text)]">
          VC
        </div>

        <div>
          <div className="text-lg font-semibold leading-tight text-[var(--text)]">
            {"VegeCastSL Dashboard"}
          </div>
          <div className="text-xs text-[var(--text-2)]">
            {t.appTagline ?? "Price Monitoring & Forecasts"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </header>
  );
}
