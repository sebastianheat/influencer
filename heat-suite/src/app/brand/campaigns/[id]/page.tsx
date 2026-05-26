import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui";
import { CampaignPipeline } from "@/components/CampaignPipeline";
import { CampaignPlannerCard } from "@/components/CampaignPlannerCard";
import {
  applicationsForCampaign,
  campaigns,
  getCampaign,
  getInfluencer,
} from "@/lib/data";
import { clp, compact, dateShort } from "@/lib/format";

export function generateStaticParams() {
  return campaigns.map((c) => ({ id: c.id }));
}

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
  const campaign = getCampaign(id);
  if (!campaign) notFound();

  const apps = applicationsForCampaign(campaign.id);
  const accepted = apps
    .filter((a) => a.status === "accepted")
    .map((a) => getInfluencer(a.influencerId))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
  const preselection = apps
    .filter((a) => a.status === "pending" || a.status === "shortlisted")
    .map((a) => getInfluencer(a.influencerId))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .map((i) => ({ id: i.id, name: i.name, handle: i.handle }));

  const invest = accepted.reduce(
    (s, i) => s + (apps.find((a) => a.influencerId === i.id)?.proposedRate ?? 0),
    0,
  );
  const reach = accepted.reduce((s, i) => s + i.reach, 0);
  const applicants = apps
    .map((a) => getInfluencer(a.influencerId))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

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
          sub={`${accepted.length} en curso · 0 finalizadas`}
        />
        <Stat
          icon="💳"
          label="Inversión realizada"
          value={clp(invest)}
          sub={accepted.length ? "Pagos en garantía" : "Aún sin creadores contratados"}
        />
        <Stat icon="🎁" label="Canje entregado" value="$0" sub="Aún sin canjes entregados" />
        <Stat icon="🎬" label="Piezas aprobadas" value="0" unit="piezas" sub="Aún sin piezas aprobadas" />
        <Stat
          icon="📈"
          label="Reach orgánico"
          value={compact(reach)}
          sub={`${campaign.applicants > 0 ? campaign.payPerCreator / 100 : 0}% engagement`}
        />
      </div>

      {/* Pipeline */}
      <div className="mt-6">
        <CampaignPipeline campaignId={campaign.id} preselection={preselection} />
      </div>
    </>
  );
}
