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

export default function Settings() {
  const [active, setActive] = useState("profile");

  return (
    <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
      {/* Secondary nav */}
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

      {/* Content */}
      <div>
        {active === "profile" ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-extrabold tracking-tight text-ink">
                Configurar mi perfil
              </h1>
              <Button>Guardar cambios</Button>
            </div>

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
                  <Field
                    label="Correo electrónico"
                    type="email"
                    placeholder="yanezsebastian1000@gmail.com"
                  />
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
        ) : (
          <>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">
              {sections.flatMap((s) => s.items).find((i) => i.key === active)?.label}
            </h1>
            <div className="mt-6 flex flex-col items-center justify-center rounded-[14px] border border-dashed border-line-strong bg-soft py-20 text-center">
              <div className="text-4xl">
                {sections.flatMap((s) => s.items).find((i) => i.key === active)?.icon}
              </div>
              <p className="mt-3 font-bold text-ink">Próximamente</p>
              <p className="mt-1 text-sm text-soft-ink">
                Esta sección estará disponible en breve.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
