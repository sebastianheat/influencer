import Link from "next/link";
import type { Influencer } from "@/lib/types";
import { compact, money } from "@/lib/format";
import { Avatar, Badge, PlatformChips } from "./ui";

export function InfluencerCard({
  influencer,
  href,
}: {
  influencer: Influencer;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center gap-3">
        <Avatar name={influencer.name} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-bold text-ink group-hover:text-accent">
              {influencer.name}
            </h3>
            {influencer.verified && <span className="text-accent">✓</span>}
          </div>
          <p className="truncate text-xs text-dim">{influencer.handle}</p>
        </div>
        <PlatformChips platforms={influencer.platforms} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {influencer.niche.map((n) => (
          <Badge key={n} tone="neutral">
            {n}
          </Badge>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-[10px] bg-soft p-3 text-center">
        <div>
          <p className="text-sm font-extrabold text-ink">
            {compact(influencer.followers)}
          </p>
          <p className="text-[11px] text-dim">seguidores</p>
        </div>
        <div className="border-x border-line">
          <p className="text-sm font-extrabold text-ink">
            {influencer.engagement}%
          </p>
          <p className="text-[11px] text-dim">engagement</p>
        </div>
        <div>
          <p className="text-sm font-extrabold text-ink">⭐ {influencer.rating}</p>
          <p className="text-[11px] text-dim">rating</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-soft-ink">
          desde{" "}
          <strong className="text-ink">{money(influencer.priceFrom)}</strong>
        </span>
        <span className="text-xs font-bold text-accent group-hover:underline">
          Ver perfil →
        </span>
      </div>
    </Link>
  );
}
