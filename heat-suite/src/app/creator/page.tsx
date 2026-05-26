import Link from "next/link";
import { CampaignCard } from "@/components/CampaignCard";
import {
  ApplicationStatusBadge,
  Card,
  PageHeader,
  StatCard,
} from "@/components/ui";
import { auth } from "@/auth";
import { currentCreatorId, getApplicationsForCreator, getCampaigns } from "@/lib/queries";
import { money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CreatorDashboard() {
  const session = await auth();
  const firstName = (session?.user?.name ?? "").split(" ")[0] || "creador";
  const me = await currentCreatorId();
  const myApps = me ? await getApplicationsForCreator(me) : [];
  const open = (await getCampaigns())
    .filter((c) => c.status === "active")
    .slice(0, 3);
  const earnings = myApps
    .filter((a) => a.app.status === "accepted")
    .reduce((s, a) => s + a.app.proposedRate, 0);

  return (
    <>
      <PageHeader
        title={`Hola, ${firstName} 👋`}
        subtitle="Estas son las campañas que encajan con tu perfil."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Postulaciones activas" value={String(myApps.length)} icon="📨" />
        <StatCard
          label="Colaboraciones"
          value={String(myApps.filter((a) => a.app.status === "accepted").length)}
          icon="🤝"
        />
        <StatCard label="Ganancias confirmadas" value={money(earnings)} icon="💰" />
        <StatCard label="Match score" value="92%" delta="Muy alto" icon="✨" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Campañas recomendadas</h2>
            <Link href="/creator/campaigns" className="text-sm font-semibold text-accent hover:underline">
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
              {myApps.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-dim">
                  Aún no te has postulado.
                </p>
              )}
              {myApps.map(({ app, campaign }) => (
                <Link
                  key={app.id}
                  href={`/creator/campaigns/${app.campaignId}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-soft"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-card text-lg">
                    {campaign.brandLogo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{campaign.title}</p>
                    <p className="truncate text-xs text-dim">{campaign.brand}</p>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
