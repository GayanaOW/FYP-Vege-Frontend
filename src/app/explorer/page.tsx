"use client";

import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "@/lib/adminApi";
import { useLanguage } from "@/context/LanguageContext";

type ExplorerPoint = {
  date: string;
  value: number;
};

type ExplorerResponse = {
  ok: boolean;
  vegetable: string;
  from: string;
  to: string;
  summary: {
    count: number;
    latest: number | null;
    min: number | null;
    max: number | null;
  };
  series: ExplorerPoint[];
};

const VEG_OPTIONS = [
  "Import Potatoes",
  "Import Big Onions",
  "Import Red Onions",
  "Import Chillies",
  "Carrots",
  "Cabbages",
  "Tomatoes",
];

export default function ExplorerPage() {
  const { t } = useLanguage();

  const [veg, setVeg] = useState("Import Potatoes");
  const [from, setFrom] = useState("2020-01-01");
  const [to, setTo] = useState("2020-12-31");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExplorerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE}/api/public/explorer?veg=${encodeURIComponent(
        veg
      )}&from=${from}&to=${to}`;

      const res = await fetch(url);
      const json: ExplorerResponse = await res.json();

      if (!res.ok || !json.ok) throw new Error("API_ERROR");
      setData(json);
    } catch {
      setError("Failed to load explorer data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const latestRows = useMemo(() => {
    return data?.series?.slice(-20).reverse() ?? [];
  }, [data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text)]">
          {t.navExplorer ?? "Explorer"}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-2)]">
          Explore historical vegetable prices by date range.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="text-sm text-[var(--text-2)]">Vegetable</label>
            <select
              value={veg}
              onChange={(e) => setVeg(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
            >
              {VEG_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[var(--text-2)]">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
            />
          </div>

          <div>
            <label className="text-sm text-[var(--text-2)]">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchData}
              className="w-full rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Load Data
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Rows" value={loading ? "..." : data?.summary?.count ?? "—"} />
        <StatCard label="Latest" value={loading ? "..." : data?.summary?.latest ?? "—"} />
        <StatCard label="Min" value={loading ? "..." : data?.summary?.min ?? "—"} />
        <StatCard label="Max" value={loading ? "..." : data?.summary?.max ?? "—"} />
      </div>

      {/* Simple chart placeholder style */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--text)]">
          Historical Prices
        </h2>
        <p className="mt-1 text-xs text-[var(--text-2)]">
          {veg} from {from} to {to}
        </p>

        <div className="mt-4 h-64 overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
          {loading ? (
            <div className="text-sm text-[var(--text-2)]">Loading...</div>
          ) : data?.series?.length ? (
            <div className="space-y-2">
              {data.series.slice(-30).map((p) => (
                <div
                  key={p.date}
                  className="flex items-center justify-between rounded-lg bg-[var(--surface)] px-3 py-2"
                >
                  <span className="text-sm text-[var(--text-2)]">{p.date}</span>
                  <span className="text-sm font-medium text-[var(--text)]">{p.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-[var(--text-2)]">No data found.</div>
          )}
        </div>
      </div>

      {/* Latest rows table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--text)]">
          Latest Historical Records
        </h2>

        <div className="mt-4 overflow-auto rounded-xl border border-[var(--border)]">
          <table className="min-w-[520px] w-full text-sm">
            <thead className="bg-[var(--surface-2)] text-[var(--text-2)]">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-3 py-3 text-[var(--text-2)]" colSpan={2}>
                    Loading...
                  </td>
                </tr>
              ) : latestRows.length ? (
                latestRows.map((r) => (
                  <tr key={r.date} className="border-t border-[var(--border)]">
                    <td className="px-3 py-2 text-[var(--text)]">{r.date}</td>
                    <td className="px-3 py-2 text-[var(--text)]">{r.value}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-3 text-[var(--text-2)]" colSpan={2}>
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="text-sm text-[var(--text-2)]">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</div>
    </div>
  );
}
