"use client";

import { useState } from "react";
import { InfluencerCard } from "@/components/InfluencerCard";
import { PageHeader } from "@/components/ui";
import { influencers } from "@/lib/data";
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
const platforms = [
  { key: "all", label: "Todas" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtube", label: "YouTube" },
  { key: "twitch", label: "Twitch" },
];

export default function Discovery() {
  const [niche, setNiche] = useState("Todos");
  const [platform, setPlatform] = useState("all");
  const [q, setQ] = useState("");

  const list = influencers.filter((i) => {
    const okNiche = niche === "Todos" || i.niche.includes(niche as never);
    const okPlat = platform === "all" || i.platforms.includes(platform as never);
    const okQ =
      q === "" ||
      i.name.toLowerCase().includes(q.toLowerCase()) ||
      i.handle.toLowerCase().includes(q.toLowerCase());
    return okNiche && okPlat && okQ;
  });

  return (
    <>
      <PageHeader
        title="Descubrir creadores"
        subtitle={`${influencers.length} creadores verificados disponibles.`}
      />

      <div className="mb-5 space-y-3 rounded-[14px] border border-line bg-surface p-4 shadow-[var(--shadow-soft)]">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o @handle…"
          className="h-11 w-full rounded-[10px] border border-line bg-soft px-3.5 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
        />
        <div className="flex flex-wrap gap-2">
          {niches.map((n) => (
            <button
              key={n}
              onClick={() => setNiche(n)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors",
                niche === n
                  ? "bg-ink text-white"
                  : "bg-card text-muted hover:bg-line",
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p.key}
              onClick={() => setPlatform(p.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors",
                platform === p.key
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line bg-surface text-muted hover:border-line-strong",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-sm text-soft-ink">{list.length} resultados</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((i) => (
          <InfluencerCard
            key={i.id}
            influencer={i}
            href={`/brand/influencers/${i.id}`}
          />
        ))}
      </div>
    </>
  );
}
