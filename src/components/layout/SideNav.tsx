"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

type NavItem = {
  href: string;
  key: string;
  fallback: string;
};

const nav: NavItem[] = [
  { href: "/", key: "navDashboard", fallback: "Dashboard" },
  { href: "/explorer", key: "navExplorer", fallback: "Explorer" },
  { href: "/predictions", key: "navPredictions", fallback: "Predictions" },
  // { href: "/admin", key: "navAdmin", fallback: "Admin" }
];

export default function SideNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="w-60 border-r border-[var(--border)] bg-[var(--surface)] p-3">
      <nav className="space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          const label = (t as any)[item.key] ?? item.fallback;

          const href = item.href || "/";

          return (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[var(--surface-2)]"
            >
              <span
                className={[
                  "h-2.5 w-2.5 rounded-full transition-colors",
                  active ? "bg-[var(--accent)]" : "bg-[var(--muted)]",
                  "group-hover:bg-[var(--accent)]"
                ].join(" ")}
              />
              <span
                className={[
                  "font-medium transition-colors",
                  active ? "text-[var(--text)]" : "text-[var(--text-2)]",
                  "group-hover:text-[var(--text)]"
                ].join(" ")}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
