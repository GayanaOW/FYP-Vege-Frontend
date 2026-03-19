"use client";

import { useTheme } from "@/context/ThemeContext";

function labelFor(theme: string) {
  if (theme === "dark") return "Dark";
  if (theme === "soft") return "Soft";
  return "Light";
}

export default function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  // Position of the knob: left (light), middle (dark), right (soft)
  const knobPos =
    theme === "light"
      ? "translate-x-0"
      : theme === "dark"
      ? "translate-x-[18px]"
      : "translate-x-[36px]";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={`Theme: ${labelFor(theme)} (click to change)`}
      className="flex items-center gap-2"
    >
      {/* Toggle pill */}
      <span
        className="
          relative h-7 w-16 rounded-full border border-[var(--border)]
          bg-[var(--surface)] transition-colors
          shadow-sm
        "
      >
        {/* Accent track glow (subtle) */}
        <span
          className="
            absolute inset-0 rounded-full opacity-30
            bg-[var(--accent-soft)]
          "
        />

        {/* Knob */}
        <span
          className={[
            "absolute top-0.5 left-0.5 h-6 w-6 rounded-full",
            "bg-[var(--bg)] border border-[var(--border)] shadow",
            "transition-transform duration-300 ease-out",
            knobPos
          ].join(" ")}
        >
          {/* Inner dot */}
          <span className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
        </span>
      </span>

      {/* Small label (optional) */}
      <span className="text-xs text-[var(--text-2)] select-none">
        {labelFor(theme)}
      </span>
    </button>
  );
}
