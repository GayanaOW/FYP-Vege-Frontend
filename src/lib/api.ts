const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function getHealth() {
  const res = await fetch(`${BASE}/api/health`, { cache: "no-store" });
  if (!res.ok) throw new Error("Backend not reachable");
  return res.json();
}
