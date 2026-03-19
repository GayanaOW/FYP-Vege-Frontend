"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/adminApi";
import { useLanguage } from "@/context/LanguageContext";

type ForecastRow = {
  date: string;
  predicted: number;
  lower?: number;
  upper?: number;
};

type HistoryRow = {
  date: string;
  value: number | null;
};

type ApiResp = {
  ok: boolean;
  target: string;
  model: string | null;
  runId: string | null;
  lastActualDate?: string | null;
  forecast: ForecastRow[];
  volatility?: number | null;
  historyLast5?: HistoryRow[];
};

const VEGETABLE_OPTIONS = [
  "Import Potatoes",
  "Import Big Onions",
  "Import Red Onions",
  "Import Chillies",
  "Carrots",
  "Cabbages",
  "Tomatoes",
];

const HORIZON_OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "28 days", value: 28 },
  { label: "42 days", value: 42 },
];

export default function PredictionsPage() {
  const { t } = useLanguage();

  const [vegetable, setVegetable] = useState("Import Potatoes");
  const [horizon, setHorizon] = useState(7);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ApiResp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPredictions = async (veg: string, h: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/public/predictions?veg=${encodeURIComponent(
          veg
        )}&horizon=${h}`
      );

      const json = (await res.json()) as ApiResp;

      if (!res.ok || !json.ok) throw new Error("API_ERROR");

      setData(json);
    } catch {
      setError("Failed to load predictions.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions(vegetable, horizon);
  }, [vegetable, horizon]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text)]">
          {t.navPredictions ?? "Predictions"}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-2)]">
          View saved forecasts from the database
        </p>
      </div>

      {/* Selectors */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm text-[var(--text-2)]">Vegetable</label>
            <select
              value={vegetable}
              onChange={(e) => setVegetable(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
            >
              {VEGETABLE_OPTIONS.map((veg) => (
                <option key={veg} value={veg}>
                  {veg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--text-2)]">Horizon</label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
            >
              {HORIZON_OPTIONS.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => loadPredictions(vegetable, horizon)}
              className="w-full rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="text-sm text-[var(--text-2)]">Selected Vegetable</div>
            <div className="mt-2 text-xl font-semibold text-[var(--text)]">
              {loading ? "..." : data?.target ?? vegetable}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="text-sm text-[var(--text-2)]">Model</div>
            <div className="mt-2 text-xl font-semibold text-[var(--text)]">
              {loading ? "..." : data?.model ?? "No model / no forecast"}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="text-sm text-[var(--text-2)]">Volatility</div>
            <div className="mt-2 text-xl font-semibold text-[var(--text)]">
              {loading
                ? "..."
                : data?.volatility != null
                ? data.volatility.toFixed(4)
                : "—"}
            </div>
          </div>
        </div>
      )}

      {/* Last 5 days historical */}
      {!error && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--text)]">
            Last 5 days historical prices
          </h2>

          <div className="mt-4 overflow-auto rounded-xl border border-[var(--border)]">
            <table className="min-w-[520px] w-full text-sm">
              <thead className="bg-[var(--surface-2)] text-[var(--text-2)]">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Actual Price</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-3 py-3 text-[var(--text-2)]" colSpan={2}>
                      Loading…
                    </td>
                  </tr>
                ) : data?.historyLast5?.length ? (
                  data.historyLast5.map((r) => (
                    <tr key={r.date} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2 text-[var(--text)]">{r.date}</td>
                      <td className="px-3 py-2 text-[var(--text)]">
                        {r.value == null ? "—" : Math.round(r.value)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-3 text-[var(--text-2)]" colSpan={2}>
                      No historical data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Forecast table */}
      {!error && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--text)]">
            Forecast ({horizon} days)
          </h2>

          <div className="mt-4 overflow-auto rounded-xl border border-[var(--border)]">
            <table className="min-w-[720px] w-full text-sm">
              <thead className="bg-[var(--surface-2)] text-[var(--text-2)]">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Predicted</th>
                  <th className="px-3 py-2 text-left">Lower (95%)</th>
                  <th className="px-3 py-2 text-left">Upper (95%)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-3 py-3 text-[var(--text-2)]" colSpan={4}>
                      Loading…
                    </td>
                  </tr>
                ) : data?.forecast?.length ? (
                  data.forecast.map((r) => (
                    <tr key={r.date} className="border-t border-[var(--border)]">
                      <td className="px-3 py-2 text-[var(--text)]">{r.date}</td>
                      <td className="px-3 py-2 text-[var(--text)]">
                        {r.predicted}
                      </td>
                      <td className="px-3 py-2 text-[var(--text)]">
                        {r.lower ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-[var(--text)]">
                        {r.upper ?? "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-3 text-[var(--text-2)]" colSpan={4}>
                      No saved forecast available for this vegetable.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}