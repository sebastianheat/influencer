import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicantsManager } from "@/components/ApplicantsManager";
import {
  Badge,
  Button,
  Card,
  CampaignStatusBadge,
  PlatformChips,
  ProgressBar,
} from "@/components/ui";
import {
  applicationsForCampaign,
  campaigns,
  getCampaign,
  getInfluencer,
} from "@/lib/data";
import { compact, dateShort, daysLeft, money } from "@/lib/format";

export function generateStaticParams() {
  return campaigns.map((c) => ({ id: c.id }));
}

export default async function CampaignDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaign(id);
  if (!campaign) notFound();

  const rows = applicationsForCampaign(campaign.id)
    .map((app) => ({ app, inf: getInfluencer(app.influencerId)! }))
    .filter((r) => r.inf);

  return (
    <>
      <Link
        href="/brand/campaigns"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-soft-ink hover:text-ink"
      >
        ← Volver a campañas
      </Link>

      {/* Hero */}
      <div className={`relative overflow-hidden rounded-[18px] ${campaign.cover} p-6 sm:p-8`}>
        <div className="absolute inset-0 bg-[radial-gradient(70%_100%_at_15%_0%,rgba(255,255,255,0.25),transparent)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-4 text-white">
          <div className="flex items-start gap-4">
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
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="!border-white/30 !bg-white/10 !text-white backdrop-blur hover:!bg-white/20"
            >
              Editar
            </Button>
            <Button className="bg-white !text-ink hover:bg-white/90">
              Publicar oferta
            </Button>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-xs font-medium text-soft-ink">Presupuesto</p>
          <p className="mt-1 text-xl font-extrabold text-ink">
            {money(campaign.budget)}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-soft-ink">Por creador</p>
          <p className="mt-1 text-xl font-extrabold text-ink">
            {money(campaign.payPerCreator)}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-soft-ink">Plazas cubiertas</p>
          <p className="mt-1 text-xl font-extrabold text-ink">
            {campaign.filled}/{campaign.spots}
          </p>
          <div className="mt-2">
            <ProgressBar value={campaign.filled} max={campaign.spots} />
          </div>
        </Card>
        <Card>
          <p className="text-xs font-medium text-soft-ink">Cierre</p>
          <p className="mt-1 text-xl font-extrabold text-ink">
            {daysLeft(campaign.deadline)}d
          </p>
          <p className="text-xs text-dim">{dateShort(campaign.deadline)}</p>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Applicants */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">
              Postulaciones ({campaign.applicants})
            </h2>
            <Button href="/brand/influencers" variant="secondary" size="sm">
              🔍 Invitar creadores
            </Button>
          </div>
          <ApplicantsManager initial={rows} />
        </div>

        {/* Sidebar: brief */}
        <div className="space-y-5">
          <Card>
            <h3 className="font-bold text-ink">Brief</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {campaign.brief}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
              <span className="text-xs text-soft-ink">Plataformas</span>
              <PlatformChips platforms={campaign.platforms} />
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-ink">Entregables</h3>
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
            <h3 className="font-bold text-ink">Requisitos</h3>
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
      </div>
    </>
  );
}
