import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  PlatformChips,
  StatCard,
} from "@/components/ui";
import { Avatar } from "@/components/ui";
import { getInfluencer, influencers } from "@/lib/data";
import { compact, money } from "@/lib/format";

export function generateStaticParams() {
  return influencers.map((i) => ({ id: i.id }));
}

export default async function InfluencerProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inf = getInfluencer(id);
  if (!inf) notFound();

  return (
    <>
      <Link
        href="/brand/influencers"
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-soft-ink hover:text-ink"
      >
        ← Volver al buscador
      </Link>

      <Card className="overflow-hidden !p-0">
        <div className="heat-gradient h-28" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="rounded-full border-4 border-surface">
                <Avatar name={inf.name} size={84} />
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight text-ink">
                    {inf.name}
                  </h1>
                  {inf.verified && <Badge tone="accent">✓ Verificado</Badge>}
                </div>
                <p className="text-sm text-dim">
                  {inf.handle} · {inf.location}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pb-1">
              <Button variant="secondary">Mensaje</Button>
              <Button>Invitar a campaña</Button>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
            {inf.bio}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {inf.niche.map((n) => (
              <Badge key={n} tone="neutral">
                {n}
              </Badge>
            ))}
            <span className="ml-1">
              <PlatformChips platforms={inf.platforms} />
            </span>
          </div>
        </div>
      </Card>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Seguidores" value={compact(inf.followers)} icon="👥" />
        <StatCard label="Engagement" value={`${inf.engagement}%`} icon="❤️" />
        <StatCard label="Rating" value={`${inf.rating} / 5`} icon="⭐" />
        <StatCard
          label="Campañas completadas"
          value={String(inf.completedCampaigns)}
          icon="✅"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-bold text-ink">Contenido destacado</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-[12px] heat-gradient-soft opacity-90"
                style={{ filter: `hue-rotate(${i * 35}deg)` }}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-ink">Tarifas</h2>
          <p className="mt-3 text-sm text-soft-ink">A partir de</p>
          <p className="text-3xl font-extrabold text-ink">
            {money(inf.priceFrom)}
          </p>
          <p className="text-xs text-dim">por colaboración</p>
          <div className="mt-5 space-y-2">
            <Button full>Invitar a campaña</Button>
            <Button variant="secondary" full>
              Añadir a lista
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
