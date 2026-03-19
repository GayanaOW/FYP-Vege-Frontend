import { useLanguage } from "@/context/LanguageContext";

export default function KpiGrid() {
  const { t } = useLanguage();

  const kpis = [
    { label: t.kpiAvgPrice, value: "Rs 2,450" },
    { label: t.kpiWeeklyChange, value: "+4.2%" },
    { label: t.kpiTopRiser, value: "Carrot" },
    { label: t.kpiVolatility, value: "High" }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <p className="text-sm text-[var(--text-2)]">{kpi.label}</p>
          <p className="mt-2 text-xl font-semibold text-[var(--text)]">
            {kpi.value}
          </p>
        </div>
      ))}
    </div>
  );
}
