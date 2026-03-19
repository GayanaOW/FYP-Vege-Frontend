"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { API_BASE, getAdminToken } from "@/lib/adminApi";


type PreviewPayload = {
  ok: boolean;

  exportId?: string;
  exportFilename?: string;

  stats?: { dates?: number; columns?: number };
  preview?: Record<string, any>[];
  full?: { date: string; values: Record<string, any> }[];
};



export default function AdminUploadPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [vegFile, setVegFile] = useState<File | null>(null);
  const [extFile, setExtFile] = useState<File | null>(null);

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const [previewData, setPreviewData] = useState<PreviewPayload | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const previewRows = previewData?.preview ?? [];
  
  const tableColumns = useMemo(() => {
    if (!previewRows.length) return [];
    // columns from first row keys
    return Object.keys(previewRows[0]);
  }, [previewRows]);

  const authGuard = () => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return null;
    }
    return token;
  };


  const downloadExport = async (exportId: string, filename?: string) => {
  const token = getAdminToken();
  if (!token) return;

  const res = await fetch(`${API_BASE}/api/admin/upload/export/${exportId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return;

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "train_ready.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
};


  const handlePreview = async () => {
    setMessage(null);
    const token = authGuard();
    if (!token) return;

    if (!vegFile || !extFile) {
      setMessage({ type: "err", text: t.adminUploadNoPreview });
      return;
    }

    setLoadingPreview(true);
    setPreviewData(null);

    try {
      const form = new FormData();
      form.append("vegFile", vegFile);
      form.append("externalFile", extFile);

      const res = await fetch(`${API_BASE}/api/admin/upload/preview`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }

      const data = (await res.json()) as PreviewPayload;

      if (!res.ok || !data.ok) {
        throw new Error("preview_failed");
      }

      setPreviewData(data);
      if (data.exportId) {
        await downloadExport(data.exportId, data.exportFilename);
      }
    } catch (e) {
      setMessage({ type: "err", text: t.adminUploadError });
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleConfirmSave = async () => {
    setMessage(null);
    const token = authGuard();
    if (!token) return;

    if (!previewData?.full || previewData.full.length === 0) {
      setMessage({ type: "err", text: t.adminUploadNoPreview });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/upload/confirm`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows: previewData.full }),
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error("save_failed");

      setMessage({ type: "ok", text: `${t.adminUploadSuccess} (${data.savedDates})` });
    } catch (e) {
      setMessage({ type: "err", text: t.adminUploadError });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">
            {t.adminUploadTitle}
          </h1>
          <p className="text-sm text-[var(--text-2)]">
            {t.adminUploadSubtitle}
          </p>
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] transition"
        >
          ← Admin
        </button>
      </div>

      {/* File pickers */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm font-medium text-[var(--text)]">
            {t.adminUploadVegFile}
          </p>
          <input
            type="file"
            accept=".xlsx"
            className="mt-3 block w-full text-sm text-[var(--text-2)] file:mr-4 file:rounded-xl file:border file:border-[var(--border)] file:bg-[var(--surface-2)] file:px-4 file:py-2 file:text-[var(--text)] hover:file:bg-[var(--surface)]"
            onChange={(e) => setVegFile(e.target.files?.[0] ?? null)}
          />
          {vegFile && (
            <p className="mt-2 text-xs text-[var(--muted)]">{vegFile.name}</p>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm font-medium text-[var(--text)]">
            {t.adminUploadExtFile}
          </p>
          <input
            type="file"
            accept=".xlsx"
            className="mt-3 block w-full text-sm text-[var(--text-2)] file:mr-4 file:rounded-xl file:border file:border-[var(--border)] file:bg-[var(--surface-2)] file:px-4 file:py-2 file:text-[var(--text)] hover:file:bg-[var(--surface)]"
            onChange={(e) => setExtFile(e.target.files?.[0] ?? null)}
          />
          {extFile && (
            <p className="mt-2 text-xs text-[var(--muted)]">{extFile.name}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handlePreview}
          disabled={loadingPreview}
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60 transition"
        >
          {loadingPreview ? t.adminUploadSavingBtn : t.adminUploadPreviewBtn}
        </button>

        <button
          onClick={handleConfirmSave}
          disabled={!previewData?.full?.length || saving}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-50 transition"
        >
          {saving ? t.adminUploadSavingBtn : t.adminUploadSaveBtn}
        </button>

        {message && (
          <div
            className={[
              "rounded-xl border px-3 py-2 text-sm",
              message.type === "ok"
                ? "border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                : "border-red-200 bg-red-50 text-red-700",
            ].join(" ")}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Stats + Preview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold text-[var(--text)]">
            {t.adminUploadStats}
          </h2>

          {!previewData?.ok ? (
            <p className="mt-3 text-sm text-[var(--text-2)]">
              {t.adminUploadNoPreview}
            </p>
          ) : (
            <div className="mt-4 space-y-2 text-sm text-[var(--text)]">
              <div className="flex justify-between">
                <span className="text-[var(--text-2)]">Dates</span>
                <span className="font-medium">{previewData.stats?.dates ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-2)]">Columns</span>
                <span className="font-medium">{previewData.stats?.columns ?? "—"}</span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--text)]">
            {t.adminUploadPreview}
          </h2>

          {!previewRows.length ? (
            <p className="mt-3 text-sm text-[var(--text-2)]">
              {t.adminUploadNoPreview}
            </p>
          ) : (
            <div className="mt-4 overflow-auto rounded-xl border border-[var(--border)]">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-[var(--surface-2)] text-[var(--text-2)]">
                  <tr>
                    {tableColumns.map((c) => (
                      <th key={c} className="px-3 py-2 text-left whitespace-nowrap">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, idx) => (
                    <tr key={idx} className="border-t border-[var(--border)]">
                      {tableColumns.map((c) => (
                        <td key={c} className="px-3 py-2 text-[var(--text)] whitespace-nowrap">
                          {row[c] === null || row[c] === undefined ? "—" : String(row[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
