"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const login = async () => {
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErr(data?.message || "Login failed");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      router.push("/admin");
    } catch {
      setErr("Network error");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h1 className="text-xl font-semibold text-[var(--text)]">Admin Login</h1>
        <p className="mt-1 text-sm text-[var(--text-2)]">
          Enter admin credentials to access the admin panel.
        </p>

        {err && (
          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm text-red-600">
            {err}
          </div>
        )}

        <label className="mt-4 block text-sm text-[var(--text-2)]">Username</label>
        <input
          className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="mt-4 block text-sm text-[var(--text-2)]">Password</label>
        <input
          type="password"
          className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="mt-5 w-full rounded-xl bg-[var(--accent)] px-3 py-2 font-medium text-white hover:bg-[var(--accent-hover)] transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
