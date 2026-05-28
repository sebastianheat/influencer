import Link from "next/link";
import type { Campaign } from "@/lib/types";
import { compact, daysLeft, money } from "@/lib/format";
import {
  CampaignStatusBadge,
  PlatformChips,
  ProgressBar,
} from "./ui";

export function CampaignCard({
  campaign,
  href,
  ctaLabel = "Ver detalle",
}: {
  campaign: Campaign;
  href: string;
  ctaLabel?: string;
}) {
  const left = daysLeft(campaign.deadline);
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-[14px] border border-line bg-surface shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-card)]"
    >
      <div className={`relative h-24 ${campaign.cover}`}>
        <div className="absolute inset-0 bg-[radial-gradient(80%_120%_at_20%_0%,rgba(255,255,255,0.25),transparent)]" />
        <div className="absolute left-4 top-4">
          <CampaignStatusBadge status={campaign.status} />
        </div>
        <div className="absolute -bottom-5 left-4 flex h-12 w-12 items-center justify-center rounded-[12px] border-2 border-surface bg-surface text-2xl shadow-[var(--shadow-soft)]">
          {campaign.brandLogo}
        </div>
      </div>

      <div className="px-4 pb-4 pt-7">
        <div className="flex min-w-0 items-center gap-1.5 text-xs">
          <span className="min-w-0 truncate font-semibold text-soft-ink">
            {campaign.brand}
          </span>
          <span className="shrink-0 text-dim">·</span>
          <span className="min-w-0 truncate text-dim">{campaign.niche}</span>
        </div>
        <h3 className="mt-1 line-clamp-1 font-bold text-ink group-hover:text-accent">
          {campaign.title}
        </h3>

        <div className="mt-3 flex min-w-0 items-center justify-between gap-2">
          <PlatformChips platforms={campaign.platforms} />
          <span className="shrink-0 whitespace-nowrap text-sm font-extrabold text-ink">
            {money(campaign.payPerCreator)}
            <span className="text-xs font-medium text-dim"> /creador</span>
          </span>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex min-w-0 items-center justify-between gap-2 text-xs text-soft-ink">
            <span className="min-w-0 truncate">
              {campaign.filled}/{campaign.spots} plazas
            </span>
            <span className="shrink-0 whitespace-nowrap">
              {compact(campaign.applicants)} postulaciones
            </span>
          </div>
          <ProgressBar value={campaign.filled} max={campaign.spots} />
        </div>

        <div className="mt-4 flex min-w-0 items-center justify-between gap-2 border-t border-line pt-3">
          <span className="min-w-0 truncate text-xs font-semibold text-soft-ink">
            {left > 0 ? `⏳ ${left} días restantes` : "Cerrada"}
          </span>
          <span className="shrink-0 whitespace-nowrap text-xs font-bold text-accent group-hover:underline">
            {ctaLabel} →
          </span>
        </div>
      </div>
    </Link>
  );
}
