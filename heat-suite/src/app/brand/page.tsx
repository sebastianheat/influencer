import Link from "next/link";
import { CampaignCard } from "@/components/CampaignCard";
import {
  ApplicationStatusBadge,
  Avatar,
  Button,
  Card,
  PageHeader,
  StatCard,
} from "@/components/ui";
import {
  applications,
  campaigns,
  getCampaign,
  getInfluencer,
} from "@/lib/data";
import { money } from "@/lib/format";

export default function BrandDashboard() {
  const myCampaigns = campaigns.slice(0, 3);
  const recentApps = applications.slice(0, 5);
  const totalSpend = campaigns.reduce((a, c) => a + c.payPerCreator * c.filled, 0);

  return (
    <>
      <PageHeader
        title="Hola, Aurora Studio 👋"
        subtitle="Aquí tienes el resumen de tus campañas activas."
        action={
          <Button href="/brand/campaigns/new">+ Nueva campaña</Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Campañas activas" value="3" delta="+1 este mes" icon="🎯" />
        <StatCard
          label="Postulaciones"
          value="80"
          delta="+24 esta semana"
          icon="📨"
        />
        <StatCard label="Creadores activos" value="19" icon="🤝" />
        <StatCard label="Inversión total" value={money(totalSpend)} icon="💳" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Tus campañas</h2>
            <Link
              href="/brand/campaigns"
              className="text-sm font-semibold text-accent hover:underline"
            >
              Ver todas →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {myCampaigns.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                href={`/brand/campaigns/${c.id}`}
                ctaLabel="Gestionar"
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Postulaciones recientes</h2>
          </div>
          <Card padded={false}>
            <div className="divide-y divide-line">
              {recentApps.map((app) => {
                const inf = getInfluencer(app.influencerId);
                const cmp = getCampaign(app.campaignId);
                if (!inf) return null;
                return (
                  <div
                    key={app.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <Avatar name={inf.name} size={38} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {inf.name}
                      </p>
                      <p className="truncate text-xs text-dim">{cmp?.title}</p>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
