"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "./ui";
import { cn } from "@/lib/cn";

export type PipelineMember = { id: string; name: string; handle: string };

export type PipelineStage = {
  key: string;
  label: string;
  icon: string;
  members: PipelineMember[];
  tone: "neutral" | "warning" | "accent" | "success" | "danger";
};

const TONE: Record<
  PipelineStage["tone"],
  { count: string }
> = {
  neutral: { count: "bg-soft text-soft-ink" },
  warning: { count: "bg-warning-bg text-warning" },
  accent: { count: "bg-accent-soft text-accent" },
  success: { count: "bg-success-bg text-success" },
  danger: { count: "bg-danger-bg text-danger" },
};

export function CampaignPipeline({
  campaignId,
  stages,
}: {
  campaignId: string;
  stages: PipelineStage[];
}) {
  return (
    <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
      <h2 className="mb-4 text-lg font-bold text-ink">Pipeline de la campaña</h2>
      <div className="space-y-2">
        {stages.map((s) => (
          <PipelineRow key={s.key} campaignId={campaignId} stage={s} />
        ))}
      </div>
    </div>
  );
}

function PipelineRow({
  campaignId,
  stage,
}: {
  campaignId: string;
  stage: PipelineStage;
}) {
  // Auto-expand stages with content; collapse empty ones.
  const [open, setOpen] = useState(stage.members.length > 0);
  const count = stage.members.length;
  const tone = TONE[stage.tone];

  return (
    <div className="overflow-hidden rounded-[10px] border border-line">
      <button
        onClick={() => count > 0 && setOpen((o) => !o)}
        disabled={count === 0}
        className={cn(
          "flex w-full items-center justify-between bg-soft px-4 py-3 text-left",
          count > 0 ? "hover:bg-card cursor-pointer" : "cursor-default",
        )}
      >
        <span className={cn(
          "flex items-center gap-2.5 font-semibold",
          count > 0 ? "text-ink" : "text-dim",
        )}>
          <span className="text-base">{stage.icon}</span>
          {stage.label}
        </span>
        <span className="flex items-center gap-3 text-sm">
          <span className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-bold",
            tone.count,
          )}>
            {count}
          </span>
          {count > 0 && (
            <span className="text-xs text-soft-ink">{open ? "▴" : "▾"}</span>
          )}
        </span>
      </button>
      {open && count > 0 && (
        <div className="divide-y divide-line">
          {stage.members.map((m) => (
            <Link
              key={m.id}
              href={`/brand/campaigns/${campaignId}/postulantes`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-soft"
            >
              <Avatar name={m.name} size={34} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {m.name}
                </p>
                <p className="truncate text-xs text-dim">{m.handle}</p>
              </div>
              <span className="text-xs text-dim">›</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
