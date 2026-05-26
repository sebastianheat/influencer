"use client";

import { useState } from "react";

const integrations = [
  {
    name: "Instagram",
    glyph: "IG",
    bg: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)",
    desc: "Conecta Instagram para visualizar las métricas de tu contenido orgánico.",
    cta: "Conectar Instagram",
    ecommerce: false,
  },
  {
    name: "TikTok",
    glyph: "TT",
    bg: "#000000",
    desc: "Conecta TikTok para visualizar las métricas de tu contenido orgánico.",
    cta: "Conectar TikTok",
    ecommerce: false,
  },
  {
    name: "Ecommerce",
    glyph: "🛍️",
    bg: "linear-gradient(135deg,#34D399,#10B981)",
    desc: "Conecta Shopify o WooCommerce para sincronizar tu catálogo y crear campañas más rápido. También podrás activar afiliados.",
    cta: "Conectar ecommerce",
    ecommerce: true,
  },
];

export function BrandIntegrations() {
  const [ecomView, setEcomView] = useState<null | "choose" | "woo">(null);

  return (
    <>
      <h2 className="mt-10 text-lg font-bold text-ink">Integraciones</h2>
      <div className="mt-4 grid gap-5 lg:grid-cols-3">
        {integrations.map((it) => (
          <div
            key={it.name}
            className="rounded-[14px] border border-line bg-surface p-5 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-[12px] text-sm font-bold text-white"
                  style={{ background: it.bg }}
                >
                  {it.glyph}
                </span>
                <div>
                  <p className="font-bold text-ink">{it.name}</p>
                  <p className="text-xs text-dim">Sin conectar</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-dim">
                <span className="h-2 w-2 rounded-full bg-line-strong" />
                No conectado
              </span>
            </div>
            <p className="mt-4 min-h-[40px] text-sm text-soft-ink">{it.desc}</p>
            <button
              onClick={() => it.ecommerce && setEcomView("choose")}
              className="mt-4 w-full rounded-[10px] border border-line-strong py-2.5 text-sm font-semibold text-ink hover:border-accent hover:text-accent"
            >
              {it.cta}
            </button>
          </div>
        ))}
      </div>

      {ecomView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setEcomView(null)}
        >
          <div
            className="w-full max-w-md rounded-[16px] bg-surface p-6 shadow-[var(--shadow-card)]"
            onClick={(e) => e.stopPropagation()}
          >
            {ecomView === "choose" ? (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-ink">Conectar ecommerce</h2>
                    <p className="mt-1 text-sm text-soft-ink">
                      Elige tu plataforma para sincronizar catálogo y pedidos.
                    </p>
                  </div>
                  <button onClick={() => setEcomView(null)} className="text-soft-ink">✕</button>
                </div>
                <div className="mt-5 space-y-3">
                  <a
                    href="https://apps.shopify.com/montu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-3 rounded-[12px] border border-line p-4 text-left hover:border-accent"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#5E8E3E] text-xs font-bold text-white">🛍</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink">Shopify</p>
                      <p className="text-xs text-dim">Sincronización en tiempo real con tu catálogo, pedidos y descuentos.</p>
                    </div>
                    <span className="text-dim">›</span>
                  </a>
                  <button
                    onClick={() => setEcomView("woo")}
                    className="flex w-full items-center gap-3 rounded-[12px] border border-line p-4 text-left hover:border-accent"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#7F54B3] text-xs font-bold text-white">woo</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink">WooCommerce</p>
                      <p className="text-xs text-dim">Plugin oficial para WordPress · sincronización vía REST API.</p>
                    </div>
                    <span className="text-dim">›</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-extrabold text-ink">Conectar tienda de WooCommerce</h2>
                  <button onClick={() => setEcomView(null)} className="text-soft-ink">✕</button>
                </div>
                <p className="mb-1.5 mt-4 text-[13px] font-semibold text-ink">URL de la tienda*</p>
                <input
                  placeholder="Ej: https://tutienda.cl"
                  className="h-11 w-full rounded-[10px] border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
                />
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    onClick={() => setEcomView("choose")}
                    className="rounded-[10px] border border-accent px-4 py-2 text-sm font-semibold text-accent hover:bg-accent-soft"
                  >
                    Cancelar
                  </button>
                  <button className="heat-gradient-blue rounded-[10px] px-4 py-2 text-sm font-semibold text-white">
                    Conectar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
