"use client";

import Link from "next/link";
import { useState } from "react";
import { MontuCampaignCard } from "@/components/MontuCampaignCard";
import { campaigns } from "@/lib/data";

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

const tasks = [
  { icon: "🎬", title: "Contenido por aprobar", sub: "Piezas listas para revisión", count: 3 },
  { icon: "📦", title: "ODTs por finalizar", sub: "Creadores listos para cerrar", count: 1 },
  { icon: "🎁", title: "Productos por enviar", sub: "Canjes pendientes de despacho", count: 2 },
  { icon: "✉️", title: "Mensajes sin leer", sub: "Conversaciones con creadores", count: 2 },
  { icon: "💸", title: "Comisiones por pagar", sub: "Sin comisiones pendientes por pagar", count: 0 },
];

export default function BrandDashboard() {
  const [ecomModal, setEcomModal] = useState(false);
  const active = campaigns.filter((c) => c.status === "active" || c.status === "review");

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        Hola, Sebastián 👋
      </h1>
      <p className="mt-1.5 text-soft-ink">
        Esto es lo que está pasando con tu marca.
      </p>

      {/* Campañas activas */}
      <h2 className="mt-7 text-lg font-bold text-ink">Campañas activas</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {active.slice(0, 2).map((c) => (
          <MontuCampaignCard key={c.id} campaign={c} />
        ))}
        <Link
          href="/brand/campaigns/new"
          className="flex min-h-[260px] flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-line-strong bg-soft p-6 text-center transition-colors hover:border-accent hover:bg-accent-soft"
        >
          <span className="heat-gradient-blue flex h-14 w-14 items-center justify-center rounded-[14px] text-2xl font-bold text-white shadow-[var(--shadow-accent)]">
            +
          </span>
          <p className="mt-4 font-bold text-ink">Nueva campaña</p>
          <p className="mt-1 text-sm text-soft-ink">
            Lanza una nueva activación con creadores.
          </p>
        </Link>
      </div>

      {/* Tareas + actividad */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold text-ink">Tareas pendientes</h2>
          <div className="overflow-hidden rounded-[14px] border border-line bg-surface shadow-[var(--shadow-soft)]">
            <div className="divide-y divide-line">
              {tasks.map((t) => (
                <div
                  key={t.title}
                  className="flex items-center gap-3 px-5 py-3.5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-card text-lg">
                    {t.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{t.title}</p>
                    <p className="text-xs text-dim">{t.sub}</p>
                  </div>
                  {t.count > 0 ? (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-2 text-xs font-bold text-white">
                      {t.count}
                    </span>
                  ) : (
                    <span className="text-dim">›</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-bold text-ink">Actividad reciente</h2>
          <div className="rounded-[14px] border border-line bg-surface p-4 shadow-[var(--shadow-soft)]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
                👥
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">
                  52 nuevas postulaciones en nuevaisapre.cl
                </p>
                <p className="text-xs text-dim">Hoy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integraciones */}
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
              onClick={() => it.ecommerce && setEcomModal(true)}
              className="mt-4 w-full rounded-[10px] border border-line-strong py-2.5 text-sm font-semibold text-ink hover:border-accent hover:text-accent"
            >
              {it.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Conectar ecommerce modal */}
      {ecomModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setEcomModal(false)}
        >
          <div
            className="w-full max-w-md rounded-[16px] bg-surface p-6 shadow-[var(--shadow-card)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-ink">
                  Conectar ecommerce
                </h2>
                <p className="mt-1 text-sm text-soft-ink">
                  Elige tu plataforma para sincronizar catálogo y pedidos.
                </p>
              </div>
              <button onClick={() => setEcomModal(false)} className="text-soft-ink">
                ✕
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {[
                {
                  name: "Shopify",
                  desc: "Sincronización en tiempo real con tu catálogo, pedidos y descuentos.",
                  glyph: "🛍",
                  bg: "#5E8E3E",
                },
                {
                  name: "WooCommerce",
                  desc: "Plugin oficial para WordPress · sincronización vía REST API.",
                  glyph: "woo",
                  bg: "#7F54B3",
                },
              ].map((p) => (
                <button
                  key={p.name}
                  className="flex w-full items-center gap-3 rounded-[12px] border border-line p-4 text-left hover:border-accent"
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] text-xs font-bold text-white"
                    style={{ background: p.bg }}
                  >
                    {p.glyph}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink">{p.name}</p>
                    <p className="text-xs text-dim">{p.desc}</p>
                  </div>
                  <span className="text-dim">›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
