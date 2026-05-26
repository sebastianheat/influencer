import {
  Card,
  CampaignStatusBadge,
  PageHeader,
} from "@/components/ui";
import { campaigns } from "@/lib/data";
import { dateShort, money } from "@/lib/format";

export default function AdminCampaigns() {
  const totalGmv = campaigns.reduce((s, c) => s + c.payPerCreator * c.filled, 0);

  return (
    <>
      <PageHeader
        title="Campañas"
        subtitle={`${campaigns.length} campañas · ${money(totalGmv)} en colaboraciones.`}
      />

      <Card padded={false} className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-soft text-left text-xs uppercase tracking-wide text-dim">
              <th className="px-5 py-3 font-semibold">Campaña</th>
              <th className="px-5 py-3 font-semibold">Marca</th>
              <th className="px-5 py-3 font-semibold">Presupuesto</th>
              <th className="px-5 py-3 font-semibold">Plazas</th>
              <th className="px-5 py-3 font-semibold">Cierre</th>
              <th className="px-5 py-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-soft">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-card text-lg">
                      {c.brandLogo}
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{c.title}</p>
                      <p className="text-xs text-dim">{c.niche}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-soft-ink">{c.brand}</td>
                <td className="px-5 py-3 font-semibold text-ink">
                  {money(c.budget)}
                </td>
                <td className="px-5 py-3 text-soft-ink">
                  {c.filled}/{c.spots}
                </td>
                <td className="px-5 py-3 text-soft-ink">
                  {dateShort(c.deadline)}
                </td>
                <td className="px-5 py-3">
                  <CampaignStatusBadge status={c.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
