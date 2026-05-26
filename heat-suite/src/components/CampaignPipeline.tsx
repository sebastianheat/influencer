"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "./ui";

export type PipelineMember = { id: string; name: string; handle: string };

const STAGES = [
  "Pendiente de pago",
  "ODT Enviada",
  "ODT Cancelada",
  "ODT Rechazada",
  "Envío de canje",
  "Generando contenido",
  "Evaluación de creadores",
  "Finalizadas",
];

export function CampaignPipeline({
  campaignId,
  preselection,
}: {
  campaignId: string;
  preselection: PipelineMember[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
      <h2 className="mb-4 text-lg font-bold text-ink">Pipeline de la campaña</h2>

      {/* Pre selección */}
      <div className="overflow-hidden rounded-[10px] border border-line">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between bg-soft px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2 font-semibold text-ink">
            <input
              type="checkbox"
              onClick={(e) => e.stopPropagation()}
              className="accent-[var(--color-accent)]"
            />
            Pre selección
          </span>
          <span className="flex items-center gap-2 text-sm text-soft-ink">
            <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-bold">
              {preselection.length}
            </span>
            {open ? "▴" : "▾"}
          </span>
        </button>
        {open && (
          <div className="divide-y divide-line">
            {preselection.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-dim">
                Aún no hay creadores preseleccionados.
              </p>
            ) : (
              preselection.map((m) => (
                <Link
                  key={m.id}
                  href={`/brand/campaigns/${campaignId}/postulantes`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-soft"
                >
                  <Avatar name={m.name} size={34} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {m.name}
                    </p>
                    <p className="truncate text-xs text-dim">{m.handle}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Other stages */}
      <div className="mt-2 space-y-2">
        {STAGES.map((s) => (
          <div
            key={s}
            className="flex items-center justify-between rounded-[10px] bg-soft px-4 py-3 text-sm font-medium text-dim"
          >
            {s}
            <span className="text-xs">0</span>
          </div>
        ))}
      </div>
    </div>
  );
}
