"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { fetchAdminMe } from "@/lib/adminApi";
import { fetchAdminLogs } from "@/lib/adminApi";


type AdminInfo = {
  role?: string;
  username?: string;
  iat?: number;
  exp?: number;
};

export default function AdminPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [error, setError] = useState<string>("");

  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);


  useEffect(() => {
  let mounted = true;

  (async () => {
    setLogsLoading(true);

    try {
      const me = await fetchAdminMe();
      if (!mounted) return;
      setAdmin(me.admin || {});

      const logsData = await fetchAdminLogs();
      if (!mounted) return;
      setLogs(logsData.logs || []);
    } catch (e: any) {
      if (!mounted) return;

      if (e?.message === "NO_TOKEN" || e?.message === "UNAUTHORIZED") {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }

      setError("Failed to load logs.");
      setLogs([]); // optional
    } finally {
      if (mounted) {
        setLoading(false);
        setLogsLoading(false); // ✅ important
      }
    }
  })();

  return () => {
    mounted = false;
  };
}, [router]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/admin/login");
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--text-2)]">{t.adminChecking}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">
            {t.adminTitle}
          </h1>
          <p className="text-sm text-[var(--text-2)]">{t.adminSubtitle}</p>
        </div>

        <button
          onClick={logout}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] transition"
        >
          {t.adminLogout}
        </button>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs text-[var(--muted)]">{t.adminLoggedInAs}</p>
            <p className="mt-1 text-lg font-semibold text-[var(--text)]">
              {admin?.username ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--muted)]">{t.adminRole}</p>
            <p className="mt-1 text-sm font-medium text-[var(--text)]">
              {admin?.role ?? "admin"}
            </p>
          </div>

          {error && (
            <div className="ml-auto rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
            {/* Quick actions */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-semibold text-[var(--text)]">
          {t.adminActions}
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 text-left hover:bg-[var(--surface-2)] transition"
            onClick={() => router.push("/admin/upload")}
          >
            <p className="font-medium text-[var(--text)]">{t.adminUpload}</p>
            <p className="mt-1 text-xs text-[var(--text-2)]">
              Upload CSV, preview rows, validate columns
            </p>
          </button>

          <button
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 text-left hover:bg-[var(--surface-2)] transition"
            onClick={() => router.push("/admin/retrain")}
          >
            <p className="font-medium text-[var(--text)]">{t.adminRetrain}</p>
            <p className="mt-1 text-xs text-[var(--text-2)]">
              Trigger training and store evaluation metrics
            </p>
          </button>
        </div>

        {/* Logs embedded below */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--text)]">
            {t.adminRecentActivity ?? "Recent Admin Activity"}
          </h3>
          <p className="mt-1 text-xs text-[var(--text-2)]">
            {t.adminRecentActivityHint ??
              "Latest admin actions (login, upload, retrain)."}
          </p>

          <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-2)] text-[var(--text-2)]">
                <tr>
                  <th className="px-4 py-3 text-left">
                    {t.adminLogTime ?? "Time"}
                  </th>
                  <th className="px-4 py-3 text-left">
                    {t.adminLogAction ?? "Action"}
                  </th>
                  <th className="px-4 py-3 text-left">
                    {t.adminLogStatus ?? "Status"}
                  </th>
                </tr>
              </thead>

              <tbody>
                {logsLoading && (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-sm text-[var(--text-2)]">
                      Loading logs...
                    </td>
                  </tr>
                )}

                {!logsLoading && logs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-sm text-[var(--text-2)]">
                      No admin activity yet.
                    </td>
                  </tr>
                )}

                {!logsLoading &&
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t border-[var(--border)] text-[var(--text)]"
                    >
                      <td className="px-4 py-3 text-sm">
                        {new Date(log.created_at).toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium">{log.action}</div>
                        {log.details && (
                          <div className="text-xs text-[var(--text-2)]">
                            {log.details}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={[
                            "rounded-full px-2 py-1 text-xs",
                            log.status === "success"
                              ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                              : log.status === "queued"
                              ? "bg-[var(--surface-2)] text-[var(--text)]"
                              : "bg-red-100 text-red-700",
                          ].join(" ")}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>

            </table>
          </div>

        </div>
      </div>

    </div>
  );
}
