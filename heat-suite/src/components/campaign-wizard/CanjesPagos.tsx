"use client";

import { clp } from "@/lib/format";
import { cn } from "@/lib/cn";

export type Canje = "none" | "product" | "giftcard";
export type BudgetMode = "canje" | "fijo" | "cotizar";

const canjeOpts: { key: Canje; title: string; desc: string }[] = [
  { key: "none", title: "Sin canje", desc: "No se ofrecerán productos de canje en la campaña." },
  { key: "product", title: "Con canje", desc: "Enviarás productos a creadores para tu campaña." },
  { key: "giftcard", title: "Giftcard", desc: "Enviarás una tarjeta de canje para la tienda." },
];

export function CanjesPagos({
  canje,
  setCanje,
  mode,
  setMode,
  liquido,
  setLiquido,
}: {
  canje: Canje;
  setCanje: (c: Canje) => void;
  mode: BudgetMode;
  setMode: (m: BudgetMode) => void;
  liquido: number;
  setLiquido: (n: number) => void;
}) {
  const gross = liquido / 0.8475;
  const retencion = gross - liquido;
  const iva = gross * 0.19;
  const total = gross + iva;

  return (
    <>
      <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
        <h2 className="font-bold text-ink">Canjes</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {canjeOpts.map((o) => (
            <button
              key={o.key}
              onClick={() => setCanje(o.key)}
              className={cn(
                "rounded-[12px] border-2 p-4 text-left transition-all",
                canje === o.key
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-soft hover:border-line-strong",
              )}
            >
              <p
                className={cn(
                  "flex items-center gap-2 font-bold",
                  canje === o.key ? "text-accent" : "text-ink",
                )}
              >
                🛍 {o.title}
              </p>
              <p className="mt-1 text-sm text-soft-ink">{o.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]">
        <h2 className="font-bold text-ink">Presupuesto por creador</h2>
        <div className="mt-3 flex gap-2">
          {(
            [
              ["canje", "Solo canje"],
              ["fijo", "Presupuesto fijo"],
              ["cotizar", "Cotizar"],
            ] as [BudgetMode, string][]
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                mode === k
                  ? "bg-accent-soft text-accent"
                  : "border border-line text-muted hover:bg-soft",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "cotizar" && (
          <div className="mt-5 rounded-[12px] border border-accent/30 bg-accent-soft/50 p-4">
            <p className="flex items-center gap-2 font-bold text-ink">
              ⓘ Recibirás cotizaciones
            </p>
            <p className="mt-1 text-sm text-soft-ink">
              Una vez tu campaña esté activa, cada creador de contenido te
              enviará su presupuesto.
            </p>
          </div>
        )}

        {mode === "canje" && (
          <div className="mt-5">
            <p className="text-lg font-bold text-ink">Presupuesto</p>
            <p className="text-3xl font-extrabold text-ink">$0</p>
            <div className="mt-4 rounded-[12px] border border-accent/30 bg-accent-soft/50 p-4">
              <p className="flex items-center gap-2 font-bold text-ink">
                ⓘ Menos incentivo, menos postulaciones
              </p>
              <p className="mt-1 text-sm text-soft-ink">
                Al trabajar por canje, las campañas suelen recibir menos
                postulaciones y menor diversidad de creadores.
              </p>
            </div>
          </div>
        )}

        {mode === "fijo" && (
          <div className="mt-5">
            <p className="text-lg font-bold text-ink">Pago líquido</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-ink">
                {clp(liquido)}
              </span>
              <span className="rounded-full bg-warning-bg px-2 py-0.5 text-[11px] font-bold text-ink">
                Recomendado
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={200000}
              step={5000}
              value={liquido}
              onChange={(e) => setLiquido(Number(e.target.value))}
              className="mt-4 w-full accent-[var(--color-accent)]"
            />
            <div className="mt-4 flex flex-wrap gap-8 border-t border-line pt-4">
              <div>
                <p className="text-sm text-dim">Retención SII</p>
                <p className="font-bold text-ink">{clp(retencion)}</p>
              </div>
              <div>
                <p className="text-sm text-dim">IVA</p>
                <p className="font-bold text-ink">{clp(iva)}</p>
              </div>
              <div>
                <p className="text-sm text-dim">Total a pagar</p>
                <p className="font-bold text-ink">{clp(total)}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {[
                "Creadores intermedios.",
                "Buena edición e iluminación.",
                "Contenido más dinámico.",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted">
                  <span className="text-success">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
