"use client";

import { useState } from "react";
import { Avatar } from "./ui";
import { clp, socialCount } from "@/lib/format";
import { cn } from "@/lib/cn";

const suggested = [
  { name: "Andrea Acosta", handle: "@andiechan_", cost: 56200, inter: 742 },
  { name: "Ignacia Velásquez", handle: "@ignaaciaa.rv", cost: 42100, inter: 2600 },
];

const ageBands = [
  { label: "13-17", pct: 3.06 },
  { label: "18-24", pct: 33.26 },
  { label: "25-34", pct: 41.03 },
  { label: "35-44", pct: 15.08 },
  { label: "45-54", pct: 5.14 },
  { label: "55-64", pct: 1.58 },
  { label: "65+", pct: 0.85 },
];

function Pills<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([k, label]) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
            value === k
              ? "bg-accent-soft text-accent"
              : "border border-line text-muted hover:bg-soft",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function CampaignPlannerCard() {
  const [open, setOpen] = useState(false);
  const [calc, setCalc] = useState(false);
  const [optimize, setOptimize] = useState<"inter" | "reach" | "views">("inter");
  const [restriction, setRestriction] = useState<"inv" | "qty" | "both">("inv");
  const [amount, setAmount] = useState(0);

  const optimizeLabel = {
    inter: "interacciones",
    reach: "alcance",
    views: "views",
  }[optimize];
  const costTotal = suggested.reduce((s, c) => s + c.cost, 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-[14px] bg-sidebar p-5 text-left text-white transition-all hover:brightness-110"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-white/10 text-xl">
            💻
          </div>
          <div>
            <p className="flex items-center gap-2 font-bold">
              Campaign planner
              <span className="rounded-md bg-success px-1.5 py-0.5 text-[10px] font-bold text-white">
                NUEVO
              </span>
            </p>
            <p className="text-sm text-white/70">
              Mezcla óptima de creadores según presupuesto y objetivo.
            </p>
          </div>
        </div>
        <span className="text-white/60">›</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-5xl rounded-[20px] bg-surface shadow-[var(--shadow-card)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-line px-6 py-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💻</span>
                <div>
                  <h2 className="text-lg font-extrabold text-ink">
                    Planifica tu Campaña
                  </h2>
                  <p className="text-sm text-soft-ink">
                    Ingresa tus restricciones como presupuesto y cantidad de
                    videos, y te sugeriremos la mezcla de creadores acorde con
                    tus objetivos.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line text-soft-ink hover:bg-card"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-5 p-6 lg:grid-cols-[300px_1fr]">
              {/* Restricciones */}
              <div className="flex flex-col rounded-[14px] border border-line p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-dim">
                  Restricciones
                </p>
                <p className="mb-2 mt-4 text-sm font-bold text-ink">
                  Optimizar para
                </p>
                <Pills
                  value={optimize}
                  onChange={setOptimize}
                  options={[
                    ["inter", "Interacciones"],
                    ["reach", "Alcance"],
                    ["views", "Views"],
                  ]}
                />
                <p className="mb-2 mt-4 text-sm font-bold text-ink">
                  Tipo de restricción
                </p>
                <Pills
                  value={restriction}
                  onChange={setRestriction}
                  options={[
                    ["inv", "Inversión"],
                    ["qty", "Cantidad"],
                    ["both", "Ambos"],
                  ]}
                />
                <p className="mb-1.5 mt-4 text-sm font-bold text-ink">
                  Inversión máxima
                </p>
                <input
                  value={clp(amount)}
                  onChange={(e) =>
                    setAmount(Number(e.target.value.replace(/\D/g, "")) || 0)
                  }
                  className="h-11 w-full rounded-[10px] border border-line bg-surface px-3.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
                />
                <div className="mt-4 space-y-2.5">
                  {["Incluir preselección actual", "Instagram", "TikTok"].map((l) => (
                    <label key={l} className="flex items-center gap-2 text-sm text-muted">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-[var(--color-accent)]"
                      />
                      {l}
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => setCalc(true)}
                  className="heat-gradient-blue mt-6 rounded-[10px] py-3 text-sm font-bold text-white"
                >
                  Calcular mezcla óptima
                </button>
              </div>

              {/* Result */}
              <div className="rounded-[14px] border border-line">
                {!calc ? (
                  <div className="flex h-full min-h-[420px] flex-col items-center justify-center p-8 text-center">
                    <span className="text-5xl opacity-30">⚡</span>
                    <p className="mt-4 font-bold text-ink">Listo para sugerir</p>
                    <p className="mt-1 max-w-sm text-sm text-soft-ink">
                      Define tus restricciones a la izquierda y presiona{" "}
                      <strong>Calcular mezcla óptima</strong>. Te propondremos la
                      combinación de creadores que maximiza tu objetivo.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5 p-5">
                    <div className="heat-gradient-blue rounded-[12px] px-4 py-3 text-sm font-bold text-white">
                      Mix óptimo en base a {optimizeLabel} · inversión{" "}
                      {clp(amount || 100000)}.
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        ["Alcance", "3,4K"],
                        ["Views", "5,1K"],
                        ["Interacciones", "3,3K"],
                        ["Costo total", socialCount(costTotal)],
                      ].map(([l, v]) => (
                        <div key={l} className="rounded-[12px] border border-line p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-dim">
                            {l}
                          </p>
                          <p className="mt-1 text-xl font-extrabold text-ink">{v}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-[12px] border border-line p-4">
                      <p className="font-bold text-ink">Demografía proyectada</p>
                      <div className="mt-4 grid gap-6 sm:grid-cols-2">
                        <div className="flex items-center gap-4">
                          <div
                            className="relative flex h-24 w-24 items-center justify-center rounded-full"
                            style={{
                              background:
                                "conic-gradient(#2563EB 0 45%, #8B5CF6 45% 88%, #CBD5E1 88% 100%)",
                            }}
                          >
                            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-surface">
                              <span className="text-sm font-extrabold text-ink">3,4K</span>
                              <span className="text-[10px] text-dim">reach</span>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
                              Femenino <strong className="ml-auto">44,92 %</strong>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-sm bg-violet" />
                              Otro <strong className="ml-auto">42,62 %</strong>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-sm bg-line-strong" />
                              Masculino <strong className="ml-auto">12,46 %</strong>
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {ageBands.map((a) => (
                            <div key={a.label} className="flex items-center gap-2 text-xs">
                              <span className="w-10 text-dim">{a.label}</span>
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-card">
                                <div
                                  className="h-full rounded-full bg-accent"
                                  style={{ width: `${a.pct}%` }}
                                />
                              </div>
                              <span className="w-12 text-right font-semibold text-ink">
                                {a.pct.toLocaleString("es-CL")} %
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[12px] border border-line p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-ink">Creadores propuestos</p>
                        <p className="text-xs text-dim">
                          0 ya en preselección · {suggested.length} sugeridos nuevos
                        </p>
                      </div>
                      <div className="mt-3 divide-y divide-line">
                        {suggested.map((c) => (
                          <div key={c.handle} className="flex items-center gap-3 py-3">
                            <Avatar name={c.name} size={40} />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-ink">{c.name}</p>
                              <p className="text-xs text-dim">{c.handle} · Chile</p>
                            </div>
                            <span className="rounded-md border border-line px-2 py-0.5 text-[11px] font-semibold text-soft-ink">
                              Sugerido
                            </span>
                            <span className="w-16 text-right text-sm font-bold text-ink">
                              {socialCount(c.cost)}
                            </span>
                            <span className="hidden w-28 text-right text-sm text-soft-ink sm:block">
                              <strong className="text-ink">{socialCount(c.inter)}</strong>{" "}
                              interacciones
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="heat-gradient-blue w-full rounded-[10px] py-3 text-sm font-bold text-white">
                      Agregar todos a preselección ({suggested.length})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
