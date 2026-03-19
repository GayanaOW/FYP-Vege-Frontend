import { useLanguage } from "@/context/LanguageContext";

export default function FiltersRow() {
  const { t } = useLanguage();

  const filters = [
    t.filterVegetable,
    t.filterMarket,
    t.filterPriceType,
    t.filterDateRange
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((label) => (
        <div
          key={label}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)]"
        >
          {label}
        </div>
      ))}
    </div>
  );
}
