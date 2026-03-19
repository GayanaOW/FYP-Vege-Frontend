// "use client";

// import { useLanguage } from "@/context/LanguageContext";
// import FiltersRow from "@/components/dashboard/FiltersRow";
// import KpiGrid from "@/components/dashboard/KpiGrid";
// import PriceTrendCard from "@/components/dashboard/PriceTrendCard";
// import TopMoversChartCard from "@/components/dashboard/TopMoversChartCard";
// import TopMoversTable from "@/components/dashboard/TopMoversTable";


// export default function DashboardPage() {
//   const { t } = useLanguage();
  

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-[var(--text)]">
//             {t.dashboardTitle}
//           </h1>
//           <p className="text-sm text-[var(--text-2)]">
//             {t.dashboardSubtitle}
//           </p>
//         </div>

//         <p className="text-sm text-[var(--muted)]">
//           {t.lastUpdated}: —
//         </p>
//       </div>

//       <FiltersRow />
//       <KpiGrid />

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         <PriceTrendCard />
//         <TopMoversChartCard />
//       </div>

//       <TopMoversTable />
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import FiltersRow from "@/components/dashboard/FiltersRow";
import PriceTrendCard from "@/components/dashboard/PriceTrendCard";
import TopMoversChartCard from "@/components/dashboard/TopMoversChartCard";
import TopMoversTable from "@/components/dashboard/TopMoversTable";
import { API_BASE } from "@/lib/adminApi";

type DashboardSummary = {
  ok: boolean;
  averagePrice: number | null;
  topRiser: { target: string; rise: number } | null;
  lowestForecast: { target: string; avgPrice: number } | null;
  vegetableCount: number;
};

type DashboardDetails = {
  ok: boolean;
  topMovers: {
    target: string;
    first: number | null;
    last: number | null;
    avgPrice: number | null;
    rise: number | null;
  }[];
  priceTrend: { date: string; value: number | null }[];
};

export default function DashboardPage() {
  const { t } = useLanguage();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [details, setDetails] = useState<DashboardDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [sRes, dRes] = await Promise.all([
          fetch(`${API_BASE}/api/public/dashboard-summary`),
          fetch(`${API_BASE}/api/public/dashboard-details`),
        ]);

        const sData: DashboardSummary = await sRes.json();
        const dData: DashboardDetails = await dRes.json();

        if (sRes.ok && sData.ok) setSummary(sData);
        if (dRes.ok && dData.ok) setDetails(dData);
      } catch (e) {
        console.error("Failed to load dashboard", e);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">
            {t.dashboardTitle}
          </h1>
          <p className="text-sm text-[var(--text-2)]">
            {t.dashboardSubtitle}
          </p>
        </div>

        <p className="text-sm text-[var(--muted)]">
          {t.lastUpdated}: —
        </p>
      </div>

      <FiltersRow />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={t.kpiAvgPrice}
          value={loading ? "..." : summary?.averagePrice != null ? `Rs ${summary.averagePrice}` : "—"}
        />
        <KpiCard
          label={t.kpiTopRiser}
          value={loading ? "..." : summary?.topRiser?.target ?? "—"}
          subValue={!loading && summary?.topRiser ? `+${summary.topRiser.rise}` : undefined}
        />
        <KpiCard
          label={t.kpiLowestForecast}
          value={loading ? "..." : summary?.lowestForecast?.target ?? "—"}
          subValue={
            !loading && summary?.lowestForecast
              ? `Rs ${summary.lowestForecast.avgPrice}`
              : undefined
          }
        />
        <KpiCard
          label={t.kpiForecastedVegetables}
          value={loading ? "..." : summary?.vegetableCount ?? "—"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PriceTrendCard data={details?.priceTrend ?? []} loading={loading} />
        <TopMoversChartCard data={details?.topMovers ?? []} loading={loading} />
      </div>

      <TopMoversTable data={details?.topMovers ?? []} loading={loading} />
    </div>
  );
}

function KpiCard({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string | number;
  subValue?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-sm text-[var(--text-2)]">{label}</p>
      <p className="mt-2 text-xl font-semibold text-[var(--text)]">
        {value}
      </p>
      {subValue && (
        <p className="mt-1 text-xs text-[var(--muted)]">{subValue}</p>
      )}
    </div>
  );
}