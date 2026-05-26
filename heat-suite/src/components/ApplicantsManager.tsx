"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ApplicationStatusBadge,
  Avatar,
  Badge,
  Button,
  PlatformChips,
} from "./ui";
import type { Application, Influencer } from "@/lib/types";
import { compact, dateShort, money } from "@/lib/format";
import { cn } from "@/lib/cn";

type Row = { app: Application; inf: Influencer };

export function ApplicantsManager({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [tab, setTab] = useState<"all" | "pending" | "shortlisted" | "accepted">(
    "all",
  );

  const setStatus = (appId: string, status: Application["status"]) =>
    setRows((rs) =>
      rs.map((r) => (r.app.id === appId ? { ...r, app: { ...r.app, status } } : r)),
    );

  const tabs = [
    { key: "all" as const, label: "Todas" },
    { key: "pending" as const, label: "Pendientes" },
    { key: "shortlisted" as const, label: "Preseleccionados" },
    { key: "accepted" as const, label: "Aceptados" },
  ];

  const visible = rows.filter((r) => tab === "all" || r.app.status === tab);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const count =
            t.key === "all"
              ? rows.length
              : rows.filter((r) => r.app.status === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                tab === t.key
                  ? "bg-accent text-white"
                  : "border border-line bg-surface text-muted hover:border-line-strong",
              )}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <p className="rounded-[12px] border border-dashed border-line-strong bg-soft py-10 text-center text-sm text-soft-ink">
            No hay postulaciones en este estado.
          </p>
        )}
        {visible.map(({ app, inf }) => (
          <div
            key={app.id}
            className="rounded-[14px] border border-line bg-surface p-4 shadow-[var(--shadow-soft)]"
          >
            <div className="flex flex-wrap items-start gap-4">
              <Avatar name={inf.name} size={48} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/brand/influencers/${inf.id}`}
                    className="font-bold text-ink hover:text-accent"
                  >
                    {inf.name}
                  </Link>
                  {inf.verified && <Badge tone="accent">✓ Verificado</Badge>}
                  <ApplicationStatusBadge status={app.status} />
                </div>
                <p className="text-xs text-dim">
                  {inf.handle} · {inf.location} · {dateShort(app.appliedAt)}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-soft-ink">
                  <span>
                    <strong className="text-ink">{compact(inf.followers)}</strong>{" "}
                    seguidores
                  </span>
                  <span>
                    <strong className="text-ink">{inf.engagement}%</strong>{" "}
                    engagement
                  </span>
                  <span>⭐ {inf.rating}</span>
                  <PlatformChips platforms={inf.platforms} />
                </div>
                <p className="mt-3 rounded-[10px] bg-soft p-3 text-sm text-muted">
                  “{app.message}”
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-extrabold text-ink">
                  {money(app.proposedRate)}
                </span>
                <span className="text-[11px] text-dim">tarifa propuesta</span>
              </div>
            </div>

            {app.status !== "accepted" && app.status !== "rejected" && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
                <Button size="sm" onClick={() => setStatus(app.id, "accepted")}>
                  ✓ Aceptar
                </Button>
                {app.status !== "shortlisted" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setStatus(app.id, "shortlisted")}
                  >
                    ★ Preseleccionar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setStatus(app.id, "rejected")}
                >
                  Rechazar
                </Button>
              </div>
            )}
            {app.status === "accepted" && (
              <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-sm font-semibold text-success">
                ✓ Creador en la campaña
                <button
                  onClick={() => setStatus(app.id, "pending")}
                  className="ml-auto text-xs font-medium text-dim hover:text-ink"
                >
                  Deshacer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
