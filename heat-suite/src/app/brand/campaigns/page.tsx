import Link from "next/link";
import { Avatar } from "@/components/ui";
import {
  applicationsForCampaign,
  campaigns,
  getInfluencer,
} from "@/lib/data";
import { daysLeft } from "@/lib/format";
import type { Campaign } from "@/lib/types";

function CountChip({ n }: { n: number }) {
  return (
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-line bg-surface px-2 text-xs font-bold text-soft-ink">
      {n}
    </span>
  );
}

function MontuCampaignCard({ campaign }: { campaign: Campaign }) {
  const accepted = applicationsForCampaign(campaign.id)
    .filter((a) => a.status === "accepted" || a.status === "shortlisted")
    .map((a) => getInfluencer(a.influencerId))
    .filter(Boolean)
    .slice(0, 4);
  const left = daysLeft(campaign.deadline);

  return (
    <Link
      href={`/brand/campaigns/${campaign.id}`}
      className="group block overflow-hidden rounded-[16px] border border-line bg-surface shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
    >
      <div className={`relative h-40 ${campaign.cover}`}>
        <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_20%_0%,rgba(255,255,255,0.25),transparent)]" />
        <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Abierta
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink backdrop-blur">
          📷 {left}d
        </span>
        {accepted.length > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center">
            <div className="flex -space-x-2">
              {accepted.map((inf) => (
                <div key={inf!.id} className="rounded-full ring-2 ring-white">
                  <Avatar name={inf!.name} size={30} />
                </div>
              ))}
            </div>
            <span className="ml-2 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
              +{Math.max(0, campaign.filled - accepted.length)} disponibles
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-bold text-ink group-hover:text-accent">
            {campaign.title}
          </h3>
          <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-soft-ink">
            {campaign.tag}
          </span>
        </div>
        <p className="mt-3 border-l-2 border-line pl-2 text-xs text-dim">
          {campaign.applicants} postulaciones · {campaign.filled}/{campaign.spots} plazas
        </p>
      </div>
    </Link>
  );
}

export default function BrandCampaigns() {
  const active = campaigns.filter(
    (c) => c.status === "active" || c.status === "review",
  );
  const finished = campaigns.filter((c) => c.status === "completed");

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Mis campañas
      </h1>

      <div className="mt-7 flex items-center gap-2">
        <h2 className="text-lg font-bold text-ink">Campañas Activas</h2>
        <CountChip n={active.length} />
      </div>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {active.map((c) => (
          <MontuCampaignCard key={c.id} campaign={c} />
        ))}
        <Link
          href="/brand/campaigns/new"
          className="flex min-h-[260px] flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-line-strong bg-soft p-6 text-center transition-colors hover:border-accent hover:bg-accent-soft"
        >
          <span className="heat-gradient-blue flex h-14 w-14 items-center justify-center rounded-[14px] text-2xl font-bold text-white shadow-[var(--shadow-accent)]">
            +
          </span>
          <p className="mt-4 font-bold text-ink">Crea una nueva campaña</p>
          <p className="mt-1 text-sm text-soft-ink">
            Lanza tu próxima colaboración con creadores
          </p>
        </Link>
      </div>

      <div className="mt-10 flex items-center gap-2">
        <h2 className="text-lg font-bold text-ink">Finalizadas</h2>
        <CountChip n={finished.length} />
      </div>
      {finished.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card text-2xl text-dim">
            ⚑
          </div>
          <p className="mt-3 text-sm text-soft-ink">No hay campañas finalizadas</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {finished.map((c) => (
            <MontuCampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </>
  );
}
