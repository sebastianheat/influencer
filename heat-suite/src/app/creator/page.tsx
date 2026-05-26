import Link from "next/link";
import { CampaignCard } from "@/components/CampaignCard";
import {
  ApplicationStatusBadge,
  Card,
  PageHeader,
  StatCard,
} from "@/components/ui";
import {
  applicationsForInfluencer,
  campaigns,
  getCampaign,
} from "@/lib/data";
import { money } from "@/lib/format";

const ME = "inf-1";

export default function CreatorDashboard() {
  const myApps = applicationsForInfluencer(ME);
  const open = campaigns.filter((c) => c.status === "active").slice(0, 3);
  const earnings = myApps
    .filter((a) => a.status === "accepted")
    .reduce((s, a) => s + a.proposedRate, 0);

  return (
    <>
      <PageHeader
        title="Hola, Lucía 👋"
        subtitle="Estas son las campañas que encajan con tu perfil."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Postulaciones activas" value={String(myApps.length)} icon="📨" />
        <StatCard label="Colaboraciones" value="1" icon="🤝" />
        <StatCard label="Ganancias confirmadas" value={money(earnings)} icon="💰" />
        <StatCard label="Match score" value="92%" delta="Muy alto" icon="✨" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Campañas recomendadas</h2>
            <Link
              href="/creator/campaigns"
              className="text-sm font-semibold text-accent hover:underline"
            >
              Ver todas →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {open.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                href={`/creator/campaigns/${c.id}`}
                ctaLabel="Postularme"
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold text-ink">Mis postulaciones</h2>
          <Card padded={false}>
            <div className="divide-y divide-line">
              {myApps.map((app) => {
                const cmp = getCampaign(app.campaignId);
                return (
                  <Link
                    key={app.id}
                    href={`/creator/campaigns/${app.campaignId}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-soft"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-card text-lg">
                      {cmp?.brandLogo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {cmp?.title}
                      </p>
                      <p className="truncate text-xs text-dim">{cmp?.brand}</p>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
