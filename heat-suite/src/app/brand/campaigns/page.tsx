import Link from "next/link";
import { MontuCampaignCard } from "@/components/MontuCampaignCard";
import { campaigns } from "@/lib/data";

function CountChip({ n }: { n: number }) {
  return (
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-line bg-surface px-2 text-xs font-bold text-soft-ink">
      {n}
    </span>
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
