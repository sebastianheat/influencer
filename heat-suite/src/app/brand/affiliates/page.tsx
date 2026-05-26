"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";

function Accordion({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3.5 text-left text-sm font-bold text-ink"
      >
        {title}
        <span className="text-dim">{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <p className="pb-3.5 text-sm text-soft-ink">
          Configura los detalles de {title.toLowerCase()} para tu programa de
          afiliados.
        </p>
      )}
    </div>
  );
}

export default function Affiliates() {
  const [provider, setProvider] = useState<"shopify" | "woo" | null>(null);

  return (
    <>
      <Link
        href="/brand"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-soft-ink hover:text-ink"
      >
        ‹ Volver al inicio
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Wizard */}
        <div className="space-y-5">
          <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-dim">1 de 5</p>
                <h1 className="mt-0.5 text-xl font-extrabold text-ink">
                  Conecta tu tienda
                </h1>
              </div>
              <button
                disabled={!provider}
                className={cn(
                  "rounded-[10px] px-4 py-2 text-sm font-semibold transition-colors",
                  provider
                    ? "heat-gradient-blue text-white"
                    : "cursor-not-allowed bg-card text-dim",
                )}
              >
                Siguiente
              </button>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-card">
              <div className="heat-gradient-blue h-full w-1/5 rounded-full" />
            </div>
          </div>

          <div className="rounded-[14px] border border-line bg-surface p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-bold text-ink">
              Selecciona tu proveedor de ecommerce
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => setProvider("shopify")}
                className={cn(
                  "flex h-24 items-center justify-center rounded-[12px] border-2 bg-surface transition-all",
                  provider === "shopify"
                    ? "border-accent ring-2 ring-accent/15"
                    : "border-line hover:border-line-strong",
                )}
              >
                <span className="text-xl font-extrabold text-[#5E8E3E]">
                  🛍 shopify
                </span>
              </button>
              <button
                onClick={() => setProvider("woo")}
                className={cn(
                  "flex h-24 items-center justify-center rounded-[12px] border-2 bg-surface transition-all",
                  provider === "woo"
                    ? "border-accent ring-2 ring-accent/15"
                    : "border-line hover:border-line-strong",
                )}
              >
                <span className="rounded-md bg-[#7F54B3] px-3 py-1.5 text-lg font-extrabold text-white">
                  woo
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-[16px] border border-line bg-soft p-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-success">
            Previsualización ⓘ
          </span>

          <div className="mt-4 rounded-[14px] border border-line bg-surface p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent-soft text-xl">
                🩺
              </div>
              <div>
                <p className="text-sm font-bold text-ink">
                  Nueva Isapre — Cotiza tu plan de salud en 30 segundos
                </p>
                <p className="mt-0.5 text-xs text-dim">
                  Compara 1.782 planes de las 7 isapres del mercado. Sin alza…
                </p>
              </div>
            </div>
            <p className="mt-4 text-lg font-extrabold text-dim">
              Título del programa
            </p>
            <p className="mt-2 text-sm text-soft-ink">Fecha de inicio</p>
            <p className="text-sm text-soft-ink">Sin fecha de término</p>
          </div>

          <div className="mt-4 rounded-[14px] border border-line bg-surface px-4">
            <Accordion title="Promoción" />
            <Accordion title="Regalo de bienvenida" />
            <Accordion title="Pagos y descuentos" />
          </div>
        </div>
      </div>
    </>
  );
}
