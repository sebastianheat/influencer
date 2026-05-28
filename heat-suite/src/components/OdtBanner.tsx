"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Status = "paid" | "cancel" | "error" | "invalid_state" | "stripe_unconfigured";

const CONFIG: Record<
  Status,
  { bg: string; border: string; icon: string; iconBg: string; title: string; text: string }
> = {
  paid: {
    bg: "bg-success-bg",
    border: "border-success/30",
    icon: "✓",
    iconBg: "bg-success text-white",
    title: "Pago de ODT recibido",
    text: "La transacción fue procesada. El creador ya puede entregar su contenido.",
  },
  cancel: {
    bg: "bg-soft",
    border: "border-line",
    icon: "ⓘ",
    iconBg: "bg-soft-ink text-white",
    title: "Pago cancelado",
    text: "Cancelaste el pago. La ODT sigue en estado pendiente — podés intentar de nuevo.",
  },
  error: {
    bg: "bg-danger-bg",
    border: "border-danger/30",
    icon: "!",
    iconBg: "bg-danger text-white",
    title: "Error en el pago",
    text: "Hubo un problema generando el checkout. Intentalo de nuevo.",
  },
  invalid_state: {
    bg: "bg-warning-bg",
    border: "border-warning/30",
    icon: "!",
    iconBg: "bg-warning text-white",
    title: "ODT en estado inválido",
    text: "Esta ODT ya fue pagada o está en otro estado.",
  },
  stripe_unconfigured: {
    bg: "bg-warning-bg",
    border: "border-warning/30",
    icon: "!",
    iconBg: "bg-warning text-white",
    title: "Stripe no configurado",
    text: "Faltan las claves de Stripe para procesar pagos.",
  },
};

export function OdtBanner({ status }: { status: string }) {
  const cfg = CONFIG[status as Status];
  const [open, setOpen] = useState(true);
  if (!cfg || !open) return null;
  return (
    <div
      className={cn(
        "mb-5 flex items-start gap-3 rounded-[12px] border px-4 py-3",
        cfg.bg,
        cfg.border,
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          cfg.iconBg,
        )}
      >
        {cfg.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink">{cfg.title}</p>
        <p className="mt-0.5 text-xs text-muted">{cfg.text}</p>
      </div>
      <button
        onClick={() => setOpen(false)}
        className="shrink-0 text-lg leading-none text-dim hover:text-ink"
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>
  );
}
