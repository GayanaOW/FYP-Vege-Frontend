import { useLanguage } from "@/context/LanguageContext";

type Mover = {
  target: string;
  rise: number | null;
  avgPrice: number | null;
};

export default function TopMoversTable({
  data,
  loading,
}: {
  data: Mover[];
  loading: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="mb-3 font-medium text-[var(--text)]">
        {t.chartTopMovers}
      </h3>

      <table className="w-full text-sm">
        <thead className="text-[var(--text-2)]">
          <tr className="border-b border-[var(--border)]">
            <th className="py-2 text-left">{t.tableVegetable}</th>
            <th className="py-2 text-left">{t.tableChange}</th>
            <th className="py-2 text-left">{t.tableLatestPrice}</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td className="py-3 text-[var(--text-2)]" colSpan={3}>
                Loading...
              </td>
            </tr>
          ) : data.length ? (
            data.map((row) => (
              <tr
                key={row.target}
                className="border-b border-[var(--border)] last:border-0"
              >
                <td className="py-2 text-[var(--text)]">{row.target}</td>
                <td className="py-2 text-[var(--text)]">
                  {row.rise ?? "—"}
                </td>
                <td className="py-2 text-[var(--text)]">
                  {row.avgPrice != null ? `Rs ${row.avgPrice}` : "—"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-3 text-[var(--text-2)]" colSpan={3}>
                No top movers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}