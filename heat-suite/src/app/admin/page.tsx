import Link from "next/link";
import {
  Avatar,
  Badge,
  Button,
  Card,
  PageHeader,
  StatCard,
} from "@/components/ui";
import { adminMetrics, gmvSeries, users } from "@/lib/data";
import { compact, money } from "@/lib/format";

const months = [
  "Jun", "Jul", "Ago", "Sep", "Oct", "Nov",
  "Dic", "Ene", "Feb", "Mar", "Abr", "May",
];

export default function AdminDashboard() {
  const max = Math.max(...gmvSeries);
  const pending = users.filter((u) => u.status === "pending");

  return (
    <>
      <PageHeader
        title="Panel de control"
        subtitle="Visión global de la plataforma Heat Suite."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Usuarios totales"
          value={compact(adminMetrics.totalUsers)}
          delta={`+${adminMetrics.monthlyGrowth}% mensual`}
          icon="👥"
        />
        <StatCard
          label="GMV (mes)"
          value={money(adminMetrics.gmv)}
          delta="+12% vs anterior"
          icon="💰"
        />
        <StatCard
          label="Ingresos (mes)"
          value={money(adminMetrics.revenue)}
          icon="📈"
        />
        <StatCard
          label="Campañas activas"
          value={String(adminMetrics.activeCampaigns)}
          icon="🎯"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-ink">Volumen de transacciones (GMV)</h2>
              <p className="text-sm text-soft-ink">Últimos 12 meses · en miles de €</p>
            </div>
            <Badge tone="success">▲ {adminMetrics.monthlyGrowth}%</Badge>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2">
            {gmvSeries.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="heat-gradient-blue w-full rounded-t-md transition-all hover:opacity-80"
                    style={{ height: `${(v / max) * 100}%` }}
                    title={`${v}k €`}
                  />
                </div>
                <span className="text-[10px] text-dim">{months[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">Pendientes de aprobación</h2>
            <Badge tone="warning">{adminMetrics.pendingApprovals}</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {pending.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                {u.avatar ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-lg">
                    {u.avatar}
                  </div>
                ) : (
                  <Avatar name={u.name} size={36} />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {u.name}
                  </p>
                  <p className="truncate text-xs text-dim">
                    {u.role === "brand" ? "Marca" : "Creador"}
                  </p>
                </div>
                <button className="text-success" title="Aprobar">
                  ✓
                </button>
                <button className="text-danger" title="Rechazar">
                  ✕
                </button>
              </div>
            ))}
            {pending.length === 0 && (
              <p className="text-sm text-soft-ink">Nada pendiente. ✨</p>
            )}
          </div>
          <Button href="/admin/users" variant="secondary" full className="mt-4">
            Ver todos los usuarios
          </Button>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Marcas" value={String(adminMetrics.brands)} icon="🏢" />
        <StatCard label="Creadores" value={String(adminMetrics.creators)} icon="✨" />
        <Card>
          <p className="text-[13px] font-medium text-soft-ink">Comisión media</p>
          <p className="mt-1.5 text-2xl font-extrabold text-ink">15%</p>
          <Link
            href="/admin/campaigns"
            className="mt-1 inline-block text-xs font-semibold text-accent hover:underline"
          >
            Ver campañas →
          </Link>
        </Card>
      </div>
    </>
  );
}
