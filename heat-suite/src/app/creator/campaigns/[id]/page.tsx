import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyBox } from "@/components/ApplyBox";
import {
  Badge,
  Card,
  CampaignStatusBadge,
  PlatformChips,
} from "@/components/ui";
import { campaigns, getCampaign } from "@/lib/data";
import { compact, dateShort, daysLeft, money } from "@/lib/format";

export function generateStaticParams() {
  return campaigns.map((c) => ({ id: c.id }));
}

export default async function CreatorCampaignDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) notFound();

  return (
    <>
      <Link
        href="/creator/campaigns"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-soft-ink hover:text-ink"
      >
        ← Volver a campañas
      </Link>

      <div className={`relative overflow-hidden rounded-[18px] ${campaign.cover} p-6 sm:p-8`}>
        <div className="absolute inset-0 bg-[radial-gradient(70%_100%_at_15%_0%,rgba(255,255,255,0.25),transparent)]" />
        <div className="relative flex items-start gap-4 text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-white/15 text-3xl backdrop-blur">
            {campaign.brandLogo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CampaignStatusBadge status={campaign.status} />
              <span className="text-sm text-white/80">{campaign.niche}</span>
            </div>
            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {campaign.title}
            </h1>
            <p className="text-sm text-white/80">{campaign.brand}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <h2 className="font-bold text-ink">Sobre la campaña</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {campaign.brief}
            </p>
          </Card>

          <Card>
            <h2 className="font-bold text-ink">Qué tendrás que entregar</h2>
            <ul className="mt-3 space-y-2">
              {campaign.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-0.5 text-accent">✦</span>
                  {d}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="font-bold text-ink">Requisitos</h2>
            <div className="mt-3 mb-3">
              <Badge tone="neutral">
                Mín. {compact(campaign.minFollowers)} seguidores
              </Badge>
            </div>
            <ul className="space-y-2">
              {campaign.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-0.5 text-success">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="sticky top-20">
            <p className="text-sm text-soft-ink">Pago por creador</p>
            <p className="text-3xl font-extrabold text-ink">
              {money(campaign.payPerCreator)}
            </p>
            <div className="mt-4 space-y-2.5 border-y border-line py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-soft-ink">Plataformas</span>
                <PlatformChips platforms={campaign.platforms} />
              </div>
              <div className="flex justify-between">
                <span className="text-soft-ink">Plazas</span>
                <span className="font-semibold text-ink">
                  {campaign.spots - campaign.filled} disponibles
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-soft-ink">Cierre</span>
                <span className="font-semibold text-ink">
                  {dateShort(campaign.deadline)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-soft-ink">Tiempo restante</span>
                <span className="font-semibold text-warning">
                  {daysLeft(campaign.deadline)} días
                </span>
              </div>
            </div>
            <div className="mt-4">
              <ApplyBox suggestedRate={campaign.payPerCreator} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
