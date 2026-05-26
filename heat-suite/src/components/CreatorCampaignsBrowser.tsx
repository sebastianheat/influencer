"use client";

import { useState } from "react";
import { CampaignCard } from "@/components/CampaignCard";
import { cn } from "@/lib/cn";
import { daysLeft } from "@/lib/format";
import type { Campaign } from "@/lib/types";

type FilterKey = "all" | "paid" | "ugc" | "organic" | "closing";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "paid", label: "Con pago" },
  { key: "ugc", label: "UGC" },
  { key: "organic", label: "Orgánica" },
  { key: "closing", label: "Cerca de cerrar" },
];

export function CreatorCampaignsBrowser({ campaigns }: { campaigns: Campaign[] }) {
  const [f, setF] = useState<FilterKey>("all");

  const list = campaigns.filter((c) => {
    if (f === "paid") return c.payPerCreator > 0;
    if (f === "ugc") return c.collabTypes.includes("ugc");
    if (f === "organic") return c.tag === "Orgánico";
    if (f === "closing") return daysLeft(c.deadline) <= 14;
    return true;
  });

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Explorar</h1>
      <p className="mt-1 text-sm text-soft-ink">Campañas activas para ti</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setF(opt.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              f === opt.key
                ? "heat-gradient-blue text-white"
                : "border border-line bg-surface text-muted hover:border-line-strong",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <h2 className="mb-3 mt-7 text-lg font-bold text-ink">Puedes postular</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <CampaignCard
            key={c.id}
            campaign={c}
            href={`/creator/campaigns/${c.id}`}
            ctaLabel="Postularme"
          />
        ))}
        {list.length === 0 && (
          <p className="text-sm text-soft-ink">No hay campañas con ese filtro.</p>
        )}
      </div>
    </>
  );
}
