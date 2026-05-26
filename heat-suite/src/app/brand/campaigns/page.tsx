"use client";

import { useState } from "react";
import { CampaignCard } from "@/components/CampaignCard";
import { Button, PageHeader } from "@/components/ui";
import { campaigns } from "@/lib/data";
import type { CampaignStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const tabs: { key: CampaignStatus | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "active", label: "Activas" },
  { key: "review", label: "En revisión" },
  { key: "draft", label: "Borradores" },
  { key: "completed", label: "Completadas" },
];

export default function BrandCampaigns() {
  const [filter, setFilter] = useState<CampaignStatus | "all">("all");
  const list =
    filter === "all"
      ? campaigns
      : campaigns.filter((c) => c.status === filter);

  return (
    <>
      <PageHeader
        title="Campañas"
        subtitle="Gestiona tus campañas y revisa postulaciones."
        action={<Button href="/brand/campaigns/new">+ Nueva campaña</Button>}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const count =
            t.key === "all"
              ? campaigns.length
              : campaigns.filter((c) => c.status === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                filter === t.key
                  ? "bg-ink text-white"
                  : "bg-surface text-muted border border-line hover:border-line-strong",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "ml-2 rounded-full px-1.5 py-0.5 text-[11px]",
                  filter === t.key ? "bg-white/20" : "bg-card text-dim",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-soft-ink">No hay campañas en este estado.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              href={`/brand/campaigns/${c.id}`}
              ctaLabel="Gestionar"
            />
          ))}
        </div>
      )}
    </>
  );
}
