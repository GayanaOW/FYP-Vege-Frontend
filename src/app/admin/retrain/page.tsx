"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getAdminToken, API_BASE } from "@/lib/adminApi";

type VegCode = "potatoes" | "big_onions" | "red_onions" | "chillies";

const VEG_OPTIONS: { code: VegCode; label: string; target: string; model: string; endpoint: string }[] = [
  {
    code: "potatoes",
    label: "Import Potatoes",
    target: "Import Potatoes",
    model: "SARIMAX (with exogenous: Exchange Rate, Fuel Price)",
    endpoint: "/api/admin/predictions/generate/potatoes",
  },
  {
    code: "big_onions",
    label: "Import Big Onions",
    target: "Import Big Onions",
    model: "VAR + LSTM Hybrid",
    endpoint: "/api/admin/predictions/generate/big-onions"
  },
  {
    code: "red_onions",
    label: "Import Red Onions",
    target: "Import Red Onions",
    model: "SARIMAX",
    endpoint: "/api/admin/predictions/generate/red-onions",
  },
  {
    code: "chillies",
    label: "Import Chillies",
    target: "Import Chillies",
    model: "SARIMAX",
    endpoint: "/api/admin/predictions/generate/chillies",
  },
];

const HORIZONS = [
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "28 days", value: 28 },
  { label: "42 days (6 weeks)", value: 42 },
];

export default function AdminRetrainPage() {
  const { t } = useLanguage();

  const [veg, setVeg] = useState<VegCode>("potatoes");
  const [horizon, setHorizon] = useState<number>(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(() => {
    return VEG_OPTIONS.find((v) => v.code === veg)!;
  }, [veg]);

  const onGenerate = async () => {
    setError(null);
    setResult(null);

    const token = getAdminToken();
    if (!token) {
      setError("Admin token not found. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const url = `${API_BASE}${selected.endpoint}?horizon=${horizon}`;

      // const res = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      const res = await fetch(`${API_BASE}${selected.endpoint}?horizon=${horizon}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.message || "Generate failed");

      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Failed to generate forecasts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text)]">
          {t.adminRetrainTitle ?? "Retrain / Generate Forecasts"}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-2)]">
          {t.adminRetrainDesc ??
            "Select a vegetable, confirm the model, choose a horizon, and generate forecasts (saved to DB)."}
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        {/* Step 1: Vegetable */}
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">
            1) Select Vegetable
          </div>
          <select
            value={veg}
            onChange={(e) => setVeg(e.target.value as VegCode)}
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
          >
            {VEG_OPTIONS.map((v) => (
              <option key={v.code} value={v.code}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Model */}
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">
            2) Model for selected vegetable
          </div>
          <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text)]">
            {selected.model}
          </div>
        </div>

        {/* Step 3: Horizon */}
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">
            3) Select Horizon
          </div>
          <select
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
          >
            {HORIZONS.map((h) => (
              <option key={h.value} value={h.value}>
                {h.label}
              </option>
            ))}
          </select>
        </div>

        {/* Step 4: Generate */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGenerate}
            disabled={loading}
            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60 transition"
          >
            {loading ? "Generating..." : "Generate Forecasts"}
          </button>

          <div className="text-xs text-[var(--text-2)]">
            Saves forecast rows into <span className="font-medium">predictions_daily</span>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm text-[var(--text)]">
            {result.message}
            <div className="mt-1 text-xs text-[var(--text-2)]">
              Saved: {result.savedRows} rows • Run ID:{" "}
              <span className="font-mono">{result.runId}</span> • Horizon: {result.horizon}
              {result.lastForecastDate ? (
                <>
                  {" "}• Last forecasted day:{" "}
                  <span className="font-medium">{result.lastForecastDate}</span>
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}