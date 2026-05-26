import Link from "next/link";
import { MontuCampaignCard } from "@/components/MontuCampaignCard";
import { BrandIntegrations } from "@/components/BrandIntegrations";
import { auth } from "@/auth";
import { getCampaigns } from "@/lib/queries";

export const dynamic = "force-dynamic";

const tasks = [
  { icon: "🎬", title: "Contenido por aprobar", sub: "Piezas listas para revisión", count: 3 },
  { icon: "📦", title: "ODTs por finalizar", sub: "Creadores listos para cerrar", count: 1 },
  { icon: "🎁", title: "Productos por enviar", sub: "Canjes pendientes de despacho", count: 2 },
  { icon: "✉️", title: "Mensajes sin leer", sub: "Conversaciones con creadores", count: 2 },
  { icon: "💸", title: "Comisiones por pagar", sub: "Sin comisiones pendientes por pagar", count: 0 },
];

export default async function BrandDashboard() {
  const session = await auth();
  const firstName = (session?.user?.name ?? "").split(" ")[0] || "marca";
  const campaigns = await getCampaigns();
  const active = campaigns.filter((c) => c.status === "active" || c.status === "review");

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        Hola, {firstName} 👋
      </h1>
      <p className="mt-1.5 text-soft-ink">Esto es lo que está pasando con tu marca.</p>

      <h2 className="mt-7 text-lg font-bold text-ink">Campañas activas</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {active.slice(0, 2).map((c) => (
          <MontuCampaignCard key={c.id} campaign={c} />
        ))}
        <Link
          href="/brand/campaigns/new"
          className="flex min-h-[260px] flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-line-strong bg-soft p-6 text-center transition-colors hover:border-accent hover:bg-accent-soft"
        >
          <span className="heat-gradient-blue flex h-14 w-14 items-center justify-center rounded-[14px] text-2xl font-bold text-white shadow-[var(--shadow-accent)]">
            +
          </span>
          <p className="mt-4 font-bold text-ink">Nueva campaña</p>
          <p className="mt-1 text-sm text-soft-ink">
            Lanza una nueva activación con creadores.
          </p>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold text-ink">Tareas pendientes</h2>
          <div className="overflow-hidden rounded-[14px] border border-line bg-surface shadow-[var(--shadow-soft)]">
            <div className="divide-y divide-line">
              {tasks.map((t) => (
                <div key={t.title} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-card text-lg">
                    {t.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{t.title}</p>
                    <p className="text-xs text-dim">{t.sub}</p>
                  </div>
                  {t.count > 0 ? (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-2 text-xs font-bold text-white">
                      {t.count}
                    </span>
                  ) : (
                    <span className="text-dim">›</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold text-ink">Actividad reciente</h2>
          <div className="rounded-[14px] border border-line bg-surface p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
                👥
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">
                  Nuevas postulaciones en tus campañas
                </p>
                <p className="text-xs text-dim">Hoy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BrandIntegrations />
    </>
  );
}
