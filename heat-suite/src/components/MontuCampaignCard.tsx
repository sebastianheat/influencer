import Link from "next/link";
import { Avatar } from "./ui";
import { applicationsForCampaign, getInfluencer } from "@/lib/data";
import { daysLeft } from "@/lib/format";
import type { Campaign } from "@/lib/types";

export function MontuCampaignCard({ campaign }: { campaign: Campaign }) {
  const accepted = applicationsForCampaign(campaign.id)
    .filter((a) => a.status === "accepted" || a.status === "shortlisted")
    .map((a) => getInfluencer(a.influencerId))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
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
                <div key={inf.id} className="rounded-full ring-2 ring-white">
                  <Avatar name={inf.name} size={30} />
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
          {campaign.applicants} postulaciones · {campaign.filled}/{campaign.spots}{" "}
          plazas
        </p>
      </div>
    </Link>
  );
}
