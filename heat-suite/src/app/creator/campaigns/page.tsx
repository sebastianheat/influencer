"use client";

import { useState } from "react";
import { CampaignCard } from "@/components/CampaignCard";
import { PageHeader } from "@/components/ui";
import { campaigns } from "@/lib/data";
import { cn } from "@/lib/cn";

const niches = [
  "Todos",
  "Moda",
  "Belleza",
  "Fitness",
  "Gaming",
  "Tecnología",
  "Comida",
  "Viajes",
  "Finanzas",
];

export default function CreatorCampaigns() {
  const [niche, setNiche] = useState("Todos");
  const open = campaigns.filter(
    (c) => c.status === "active" || c.status === "review",
  );
  const list = niche === "Todos" ? open : open.filter((c) => c.niche === niche);

  return (
    <>
      <PageHeader
        title="Explorar campañas"
        subtitle="Encuentra colaboraciones que encajen con tu audiencia."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {niches.map((n) => (
          <button
            key={n}
            onClick={() => setNiche(n)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
              niche === n
                ? "bg-ink text-white"
                : "border border-line bg-surface text-muted hover:border-line-strong",
            )}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <CampaignCard
            key={c.id}
            campaign={c}
            href={`/creator/campaigns/${c.id}`}
            ctaLabel="Postularme"
          />
        ))}
      </div>
    </>
  );
}
