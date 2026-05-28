import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui";
import {
  CampaignPipeline,
  type PipelineMember,
  type PipelineStage,
} from "@/components/CampaignPipeline";
import { CampaignPlannerCard } from "@/components/CampaignPlannerCard";
import { getApplicationsForCampaign, getCampaign } from "@/lib/queries";
import { clp, compact, dateShort } from "@/lib/format";
import type { OdtStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

function Stat({
  icon,
  label,
  value,
  unit,
  sub,
}: {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  sub: string;
}) {
  return (
    <div className="rounded-[14px] border border-line bg-surface p-4 shadow-[var(--shadow-soft)]">
      <p className="flex items-center gap-1.5 text-xs font-medium text-soft-ink">
        <span>{icon}</span>
        {label}
      </p>
      <p className="mt-2 text-xl font-extrabold text-ink">
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-dim">{unit}</span>}
      </p>
      <p className="mt-0.5 text-xs text-dim">{sub}</p>
    </div>
  );
}

export default async function CampaignDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const rows = await getApplicationsForCampaign(campaign.id);
  const accepted = rows.filter((r) => r.app.status === "accepted").map((r) => r.inf);

  const toMember = (r: (typeof rows)[number]): PipelineMember => ({
    id: r.inf.id,
    name: r.inf.name,
    handle: r.inf.handle,
  });

  const byOdt = (status: OdtStatus | null) =>
    rows
      .filter((r) => r.app.status === "accepted" && r.app.odtStatus === status)
      .map(toMember);

  const stages: PipelineStage[] = [
    {
      key: "preselection",
      label: "Pre selección",
      icon: "👥",
      tone: "neutral",
      members: rows
        .filter((r) => r.app.status === "pending" || r.app.status === "shortlisted")
        .map(toMember),
    },
    {
      key: "pending_payment",
      label: "Pendiente de pago",
      icon: "💳",
      tone: "warning",
      members: byOdt("pending_payment"),
    },
    {
      key: "paid",
      label: "Generando contenido",
      icon: "🎬",
      tone: "accent",
      members: byOdt("paid"),
    },
    {
      key: "content_submitted",
      label: "En evaluación",
      icon: "📋",
      tone: "accent",
      members: byOdt("content_submitted"),
    },
    {
      key: "released",
      label: "Finalizadas · pagadas",
      icon: "✓",
      tone: "success",
      members: byOdt("released"),
    },
    {
      key: "rejected",
      label: "Rechazadas",
      icon: "↩︎",
      tone: "danger",
      members: rows
        .filter((r) => r.app.odtStatus === "rejected")
        .map(toMember),
    },
  ];

  // Inversión = todo lo pagado por ODT (incluye paid, content_submitted, released).
  // Las rechazadas no cuentan (volvieron a saldo) y las pending_payment todavía no se pagaron.
  const PAID_ODT_STATUSES = ["paid", "content_submitted", "released"];
  const invest = rows
    .filter((r) => r.app.odtStatus && PAID_ODT_STATUSES.includes(r.app.odtStatus))
    .reduce((s, r) => s + (r.app.brandAmount ?? r.app.proposedRate), 0);
  const releasedCount = rows.filter((r) => r.app.odtStatus === "released").length;
  const inProgressCount = rows.filter(
    (r) => r.app.status === "accepted" && r.app.odtStatus && r.app.odtStatus !== "released" && r.app.odtStatus !== "rejected",
  ).length;
  const reach = accepted.reduce((s, i) => s + i.reach, 0);
  const applicants = rows.map((r) => r.inf);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm text-soft-ink">
          <Link href="/brand/campaigns" className="hover:text-ink">
            Campañas
          </Link>
          <span className="text-dim">›</span>
          <span className="font-semibold text-accent">{campaign.title}</span>
        </nav>
        <button className="heat-gradient-blue rounded-[10px] px-4 py-2 text-sm font-semibold text-white">
          Campaña ▾
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-4">
          <div className={`h-14 w-14 shrink-0 rounded-[12px] ${campaign.cover}`} />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-ink">
              {campaign.title}
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-dim">
              Creada el {dateShort(campaign.createdAt)} ·
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[8px] font-bold text-white">
                SY
              </span>
              por sebastián yáñez
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="rounded-[10px] border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-accent hover:text-accent">
            📄 Brief
          </button>
          <button className="cursor-not-allowed rounded-[10px] border border-line px-4 py-2 text-sm font-semibold text-dim">
            📊 Reporte
          </button>
          <button className="cursor-not-allowed rounded-[10px] border border-line px-4 py-2 text-sm font-semibold text-dim">
            ▶ Contenidos
          </button>
        </div>
      </div>

      {/* Two cards */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Link
          href={`/brand/campaigns/${campaign.id}/postulantes`}
          className="flex items-center justify-between rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)] transition-all hover:border-accent/40"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-accent-soft text-xl">
              👥
            </div>
            <div>
              <p className="font-bold text-ink">Postulantes</p>
              <p className="text-sm text-soft-ink">
                Revisa quién quiere participar y arma tu preselección.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {applicants.slice(0, 4).map((i) => (
                <div key={i.id} className="rounded-full ring-2 ring-surface">
                  <Avatar name={i.name} size={30} />
                </div>
              ))}
            </div>
            <span className="text-dim">›</span>
          </div>
        </Link>

        <CampaignPlannerCard />
      </div>

      {/* Stats */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat
          icon="🤝"
          label="Creadores contratados"
          value={String(accepted.length)}
          unit="creadores"
          sub={`${inProgressCount} en curso · ${releasedCount} finalizadas`}
        />
        <Stat
          icon="💳"
          label="Inversión realizada"
          value={clp(invest)}
          sub={invest > 0 ? "Pagos en garantía + liberados" : "Aún sin pagos"}
        />
        <Stat icon="🎁" label="Canje entregado" value="$0" sub="Aún sin canjes entregados" />
        <Stat
          icon="🎬"
          label="Piezas aprobadas"
          value={String(releasedCount)}
          unit={releasedCount === 1 ? "pieza" : "piezas"}
          sub={releasedCount > 0 ? "Contenidos liberados" : "Aún sin piezas aprobadas"}
        />
        <Stat
          icon="📈"
          label="Reach orgánico"
          value={compact(reach)}
          sub={`${campaign.applicants > 0 ? campaign.payPerCreator / 100 : 0}% engagement`}
        />
      </div>

      {/* Pipeline */}
      <div className="mt-6">
        <CampaignPipeline campaignId={campaign.id} stages={stages} />
      </div>
    </>
  );
}
