"use client";

import { useState } from "react";

function PreviewAccordion({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[12px] border border-line bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-bold text-ink"
      >
        {title}
        <span className="text-dim">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <p className="px-4 pb-3.5 text-sm text-soft-ink">
          Se mostrará aquí cuando completes este apartado.
        </p>
      )}
    </div>
  );
}

export function CampaignPreview({
  name,
  description,
  hasImage,
}: {
  name: string;
  description: string;
  hasImage: boolean;
}) {
  return (
    <div className="lg:sticky lg:top-20">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-success">
        Previsualización ⓘ
      </span>

      <div className="mt-3 overflow-hidden rounded-[16px] border border-line bg-surface shadow-[var(--shadow-soft)]">
        {/* Cover */}
        {hasImage ? (
          <div className="heat-gradient relative flex h-52 items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(80%_120%_at_20%_0%,rgba(255,255,255,0.2),transparent)]" />
            <span className="relative text-center text-2xl font-extrabold leading-tight text-white">
              COTIZA EN
              <br />
              30 SEGUNDOS
            </span>
          </div>
        ) : (
          <div className="flex h-52 items-center justify-center bg-card text-4xl text-dim">
            ▱
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent-soft text-lg">
              🩺
            </div>
            <div>
              <p className="text-sm font-bold text-ink">
                Nueva Isapre — Cotiza tu plan de salud en 30 segundos
              </p>
              <p className="mt-0.5 text-xs text-dim">
                Compara 1.782 planes de las 7 isapres del mercado. Asesoría
                gratuita por WhatsApp.
              </p>
            </div>
          </div>

          <p className="mt-4 text-lg font-extrabold text-ink">
            {name || <span className="text-dim">Título de campaña</span>}
          </p>
          <p className="mt-1 text-sm text-soft-ink">
            {description || "Descripción de la campaña"}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <PreviewAccordion title="Productos o servicios a promocionar" />
        <PreviewAccordion title="Requisitos del creador" />
        <PreviewAccordion title="Requerimientos de contenido" />
        <PreviewAccordion title="Condiciones de la colaboración" />
        <PreviewAccordion title="Canjes y pagos adicionales" />
      </div>
    </div>
  );
}
