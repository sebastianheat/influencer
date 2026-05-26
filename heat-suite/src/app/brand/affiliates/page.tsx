import { Avatar, Card, PageHeader, StatCard } from "@/components/ui";
import { getInfluencer } from "@/lib/data";
import { money } from "@/lib/format";

const rows = [
  { inf: "inf-1", code: "THAMY10", clicks: 12840, sales: 312, commission: 2496 },
  { inf: "inf-3", code: "PAOLO15", clicks: 9870, sales: 198, commission: 1782 },
  { inf: "inf-8", code: "MARIUXI", clicks: 5410, sales: 143, commission: 1144 },
  { inf: "inf-7", code: "NATV", clicks: 3290, sales: 88, commission: 704 },
];

export default function Affiliates() {
  const totalSales = rows.reduce((s, r) => s + r.sales, 0);
  const totalComm = rows.reduce((s, r) => s + r.commission, 0);

  return (
    <>
      <PageHeader
        title="Afiliados"
        subtitle="Códigos y enlaces de afiliación de tus creadores."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Afiliados activos" value={String(rows.length)} icon="🛡️" />
        <StatCard label="Ventas atribuidas" value={String(totalSales)} icon="🛒" />
        <StatCard label="Comisiones" value={money(totalComm)} icon="💸" />
      </div>

      <Card padded={false} className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line bg-soft text-left text-xs uppercase tracking-wide text-dim">
              <th className="px-5 py-3 font-semibold">Creador</th>
              <th className="px-5 py-3 font-semibold">Código</th>
              <th className="px-5 py-3 font-semibold">Clics</th>
              <th className="px-5 py-3 font-semibold">Ventas</th>
              <th className="px-5 py-3 font-semibold">Comisión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => {
              const inf = getInfluencer(r.inf);
              return (
                <tr key={r.code} className="hover:bg-soft">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {inf && <Avatar name={inf.name} size={34} />}
                      <span className="font-semibold text-ink">{inf?.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-md bg-card px-2 py-1 font-mono text-xs font-bold text-ink">
                      {r.code}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-soft-ink">
                    {r.clicks.toLocaleString("es-ES")}
                  </td>
                  <td className="px-5 py-3 font-semibold text-ink">{r.sales}</td>
                  <td className="px-5 py-3 font-extrabold text-success">
                    {money(r.commission)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}
