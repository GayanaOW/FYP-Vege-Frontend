export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export async function fetchAdminMe() {
  const token = getAdminToken();
  if (!token) throw new Error("NO_TOKEN");

  const res = await fetch(`${API_BASE}/api/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("UNAUTHORIZED");
  }
  if (!res.ok) throw new Error("API_ERROR");

  return res.json(); // { ok: true, admin: {...} }
}

export async function fetchAdminLogs() {
  const token = getAdminToken();
  if (!token) throw new Error("NO_TOKEN");

  const res = await fetch(`${API_BASE}/api/admin/logs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("UNAUTHORIZED");
  }
  if (!res.ok) {
    throw new Error("API_ERROR");
  }

  return res.json(); // { ok: true, logs: [...] }
}

