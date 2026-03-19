type Point = {
  date: string;
  value: number | null;
};

export default function PriceTrendCard({
  data,
  loading,
}: {
  data: Point[];
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="mb-3 font-medium text-[var(--text)]">Price Trend</h3>

      <div className="rounded-xl bg-[var(--surface-2)] p-3">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-sm text-[var(--muted)]">
            Loading...
          </div>
        ) : data.length ? (
          <div className="space-y-2 max-h-48 overflow-auto">
            {data.map((p) => (
              <div
                key={p.date}
                className="flex items-center justify-between rounded-lg bg-[var(--surface)] px-3 py-2"
              >
                <span className="text-sm text-[var(--text-2)]">{p.date}</span>
                <span className="text-sm font-medium text-[var(--text)]">
                  {p.value ?? "—"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center text-sm text-[var(--muted)]">
            No trend data
          </div>
        )}
      </div>
    </div>
  );
}