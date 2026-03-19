type Mover = {
  target: string;
  rise: number | null;
};

export default function TopMoversChartCard({
  data,
  loading,
}: {
  data: Mover[];
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="mb-3 font-medium text-[var(--text)]">Top Movers</h3>

      <div className="rounded-xl bg-[var(--surface-2)] p-3">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-sm text-[var(--muted)]">
            Loading...
          </div>
        ) : data.length ? (
          <div className="space-y-3">
            {data.map((item) => {
              const rise = item.rise ?? 0;
              const width = Math.min(Math.abs(rise) * 10, 100);

              return (
                <div key={item.target}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-[var(--text)]">{item.target}</span>
                    <span className="text-[var(--text-2)]">{rise}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-[var(--surface)]">
                    <div
                      className="h-3 rounded-full bg-[var(--accent)]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center text-sm text-[var(--muted)]">
            No movers data
          </div>
        )}
      </div>
    </div>
  );
}