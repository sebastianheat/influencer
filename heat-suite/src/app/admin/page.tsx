import Link from "next/link";
import { Avatar, Badge, Button, Card, PageHeader, StatCard } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { compact, money } from "@/lib/format";

export const dynamic = "force-dynamic";

const months = ["Jun","Jul","Ago","Sep","Oct","Nov","Dic","Ene","Feb","Mar","Abr","May"];
const gmvSeries = [18, 22, 19, 28, 34, 31, 42, 38, 49, 55, 61, 73];

export default async function AdminDashboard() {
  const [totalUsers, brands, creators, activeCampaigns, recent, gmvRows] =
    await Promise.all([
      prisma.user.count(),
      prisma.brand.count(),
      prisma.creatorProfile.count(),
      prisma.campaign.count({ where: { status: "ACTIVE" } }),
      prisma.creatorProfile.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      prisma.application.findMany({
        where: { status: "ACCEPTED" },
        select: { proposedRate: true },
      }),
    ]);
  const gmv = gmvRows.reduce((s, a) => s + a.proposedRate, 0);
  const max = Math.max(...gmvSeries);

  return (
    <>
      <PageHeader title="Panel de control" subtitle="Visión global de la plataforma Heat Suite." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Usuarios totales" value={compact(totalUsers)} delta="+18,4% mensual" icon="👥" />
        <StatCard label="GMV (colaboraciones)" value={money(gmv)} delta="+12% vs anterior" icon="💰" />
        <StatCard label="Campañas activas" value={String(activeCampaigns)} icon="🎯" />
        <StatCard label="Creadores" value={compact(creators)} icon="✨" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-ink">Volumen de transacciones (GMV)</h2>
              <p className="text-sm text-soft-ink">Últimos 12 meses · en miles de €</p>
            </div>
            <Badge tone="success">▲ 18,4%</Badge>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2">
            {gmvSeries.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="heat-gradient-blue w-full rounded-t-md transition-all hover:opacity-80"
                    style={{ height: `${(v / max) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-dim">{months[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-ink">Creadores recientes</h2>
          <div className="mt-4 space-y-3">
            {recent.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <Avatar name={c.user.name} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{c.user.name}</p>
                  <p className="truncate text-xs text-dim">{c.handle}</p>
                </div>
                {c.verified && <Badge tone="accent">✓</Badge>}
              </div>
            ))}
          </div>
          <Button href="/admin/users" variant="secondary" full className="mt-4">
            Ver todos los usuarios
          </Button>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Marcas" value={String(brands)} icon="🏢" />
        <StatCard label="Creadores" value={String(creators)} icon="✨" />
        <Card>
          <p className="text-[13px] font-medium text-soft-ink">Comisión media</p>
          <p className="mt-1.5 text-2xl font-extrabold text-ink">15%</p>
          <Link href="/admin/campaigns" className="mt-1 inline-block text-xs font-semibold text-accent hover:underline">
            Ver campañas →
          </Link>
        </Card>
      </div>
    </>
  );
}
