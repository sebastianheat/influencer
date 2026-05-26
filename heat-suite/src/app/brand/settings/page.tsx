"use client";

import { useState } from "react";
import { Button, Field } from "@/components/ui";
import { cn } from "@/lib/cn";

const sections = [
  {
    label: "General",
    items: [
      { key: "profile", label: "Configurar mi perfil", icon: "👤" },
      { key: "notifications", label: "Notificaciones", icon: "🔔" },
    ],
  },
  {
    label: "Espacio de trabajo",
    items: [
      { key: "brands", label: "Marcas", icon: "🏢" },
      { key: "users", label: "Usuarios y permisos", icon: "👥" },
      { key: "integrations", label: "Integraciones", icon: "🔌" },
    ],
  },
  {
    label: "Planes y facturación",
    items: [
      { key: "plan", label: "Mi plan", icon: "💳" },
      { key: "billing", label: "Facturación", icon: "🧾" },
    ],
  },
];

function Toggle({ on }: { on: boolean }) {
  const [v, setV] = useState(on);
  return (
    <button
      onClick={() => setV((x) => !x)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        v ? "bg-accent" : "bg-line-strong",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
          v ? "left-[22px]" : "left-0.5",
        )}
      />
    </button>
  );
}

function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        {title}
      </h1>
      {action}
    </div>
  );
}

/* ---- Sections ---- */

function Profile() {
  return (
    <>
      <SectionTitle title="Configurar mi perfil" action={<Button>Guardar cambios</Button>} />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <div className="flex h-32 w-32 items-center justify-center rounded-[16px] bg-ink text-3xl font-extrabold text-white">
            SY
          </div>
          <button className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-soft-ink shadow-[var(--shadow-soft)]">
            ✎
          </button>
        </div>
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <Field label="Nombre" defaultValue="Sebastián" />
          <Field label="Apellido" defaultValue="Yáñez" />
          <div className="sm:col-span-2">
            <Field label="Correo electrónico" type="email" placeholder="tu@email.com" />
          </div>
        </div>
      </div>
      <h2 className="mt-10 text-lg font-bold text-ink">Marcas asociadas</h2>
      <div className="mt-3 border-t border-line pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent-soft text-xl">
            🩺
          </div>
          <p className="text-sm font-semibold text-ink">
            Nueva Isapre — Cotiza tu plan de salud en 30 segundos
          </p>
        </div>
      </div>
    </>
  );
}

function Notifications() {
  const rows = [
    {
      title: "Permitir mailings de sistema",
      desc: "Recibe mailings cuando recibas postulaciones, notificaciones de pagos, aprobación de contenido y más.",
      on: true,
    },
    {
      title: "Permitir mailings de marketing",
      desc: "Recibe mailings cuando identifiquemos nuevas oportunidades para tu marca, como tendencias y nuevos creadores de contenido.",
      on: false,
    },
    {
      title: "Cobros y pagos",
      desc: "Recibe mailings para notificar cobros o pagos en Heat Suite.",
      on: true,
    },
  ];
  return (
    <>
      <SectionTitle
        title="Notificaciones"
        action={<Button variant="secondary">Deshacer cambios</Button>}
      />
      <div className="divide-y divide-line">
        {rows.map((r) => (
          <div key={r.title} className="flex items-start justify-between gap-6 py-5">
            <div>
              <p className="font-bold text-ink">{r.title}</p>
              <p className="mt-1 max-w-2xl text-sm text-soft-ink">{r.desc}</p>
            </div>
            <Toggle on={r.on} />
          </div>
        ))}
      </div>
    </>
  );
}

function Integrations() {
  const apps = ["Shopify", "Woocommerce", "Instagram", "Tiktok"];
  return (
    <>
      <SectionTitle title="Integraciones" />
      <div className="rounded-[14px] border border-line bg-surface shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between px-5 py-4">
          <p className="font-bold text-ink">
            Nueva Isapre — Cotiza tu plan de salud en 30 segundos
          </p>
          <span className="text-dim">▴</span>
        </div>
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full min-w-[480px] overflow-hidden rounded-[10px] border border-line text-sm">
            <thead>
              <tr className="border-b border-line bg-soft text-left text-soft-ink">
                <th className="px-4 py-3 font-semibold">Aplicación</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Accionable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {apps.map((a) => (
                <tr key={a}>
                  <td className="px-4 py-3 text-ink">{a}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-soft-ink">
                      No conectado
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="heat-gradient-blue rounded-[8px] px-4 py-1.5 text-xs font-semibold text-white">
                      Conectar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Billing() {
  const rows = [
    { label: "Método de pago", value: "MasterCard ****6541" },
    { label: "Email de facturación", value: "No configurado" },
    { label: "RUT de facturación", value: "-" },
  ];
  return (
    <>
      <SectionTitle title="Facturación" />
      <div className="divide-y divide-line">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-6 py-5">
            <div>
              <p className="font-bold text-ink">{r.label}</p>
              <p className="mt-0.5 text-sm text-soft-ink">{r.value}</p>
            </div>
            <Button variant="secondary" size="sm">
              Cambiar
            </Button>
          </div>
        ))}
      </div>
      <h2 className="mt-8 border-b border-line pb-3 text-lg font-bold text-ink">
        Facturas
      </h2>
      <p className="mt-4 text-sm text-soft-ink">Aún no tienes facturas emitidas.</p>
    </>
  );
}

function Plan() {
  const plans = [
    {
      name: "Starter",
      current: true,
      monthly: "$59.990",
      yearly: "$359.990",
      cta: null,
      features: [
        "Contratación ilimitada de creadores",
        "Explorador de creadores",
        "Shopify y WooCommerce integrados",
        "Módulo de afiliados (hasta 100)",
        "Diagnóstico de campañas con IA",
        "Hasta 5 usuarios",
      ],
    },
    {
      name: "Plus",
      current: false,
      monthly: "$119.990",
      yearly: "$719.990",
      cta: "Seleccionar",
      features: [
        "Todo Starter más:",
        "Integración de tiendas físicas (BSale)",
        "Hasta 10 usuarios por equipo",
        "Hasta 3 marcas",
      ],
    },
    {
      name: "Enterprise",
      current: false,
      monthly: null,
      yearly: null,
      tagline: "Escala tu marca con un plan a tu medida.",
      cta: "Contactar",
      features: [
        "Todo Plus más:",
        "Marcas ilimitadas",
        "Usuarios ilimitados",
        "Hasta 1.000 afiliados",
        "Plataforma marca-blanca",
        "Ejecutivo de cuentas dedicado",
        "Facilidades de pago",
        "Reportería de campañas",
      ],
    },
  ];

  return (
    <>
      <SectionTitle title="Mi plan" />
      <div className="rounded-[14px] border border-line bg-surface p-6 shadow-[var(--shadow-soft)]">
        <h2 className="text-xl font-extrabold text-ink">Starter</h2>
        <p className="mt-2 max-w-lg text-soft-ink">
          Para marcas que están comenzando a trabajar con creadores y buscan una
          solución simple y efectiva.
        </p>
        <p className="mt-2 text-sm text-soft-ink">
          $59.990 cobrado el día 25 de cada mes.
        </p>
        <button className="mt-4 text-sm font-semibold text-accent hover:underline">
          Cancelar plan
        </button>
      </div>

      <h2 className="mt-10 border-b border-line pb-3 text-lg font-bold text-ink">
        Todos los planes
      </h2>
      <div className="mt-6 grid gap-8 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name}>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-ink">{p.name}</h3>
              {p.current && (
                <span className="rounded-md bg-success-bg px-2 py-0.5 text-[11px] font-bold text-success">
                  ACTUAL
                </span>
              )}
            </div>
            {p.monthly ? (
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <p className="text-dim">Mensual</p>
                  <p className="font-bold text-ink">{p.monthly}</p>
                </div>
                <div>
                  <p className="text-dim">Anual</p>
                  <p className="font-bold text-ink">{p.yearly}</p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-soft-ink">{p.tagline}</p>
            )}
            {p.cta && (
              <Button variant="secondary" size="sm" className="mt-4">
                {p.cta}
              </Button>
            )}
            <ul className="mt-5 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-0.5 text-success">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

function Placeholder({ label, icon }: { label: string; icon: string }) {
  return (
    <>
      <SectionTitle title={label} />
      <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-line-strong bg-soft py-20 text-center">
        <div className="text-4xl">{icon}</div>
        <p className="mt-3 font-bold text-ink">Próximamente</p>
        <p className="mt-1 text-sm text-soft-ink">
          Esta sección estará disponible en breve.
        </p>
      </div>
    </>
  );
}

export default function Settings() {
  const [active, setActive] = useState("profile");
  const current = sections.flatMap((s) => s.items).find((i) => i.key === active)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
      <nav className="space-y-5">
        {sections.map((s) => (
          <div key={s.label} className="space-y-0.5">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-dim">
              {s.label}
            </p>
            {s.items.map((it) => (
              <button
                key={it.key}
                onClick={() => setActive(it.key)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-sm font-semibold transition-colors",
                  active === it.key
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-card hover:text-ink",
                )}
              >
                <span>{it.icon}</span>
                {it.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div>
        {active === "profile" && <Profile />}
        {active === "notifications" && <Notifications />}
        {active === "integrations" && <Integrations />}
        {active === "billing" && <Billing />}
        {active === "plan" && <Plan />}
        {(active === "brands" || active === "users") && (
          <Placeholder label={current.label} icon={current.icon} />
        )}
      </div>
    </div>
  );
}
