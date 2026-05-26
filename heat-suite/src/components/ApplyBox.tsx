"use client";

import { useState } from "react";
import { Button } from "./ui";

export function ApplyBox({ suggestedRate }: { suggestedRate: number }) {
  const [stage, setStage] = useState<"idle" | "form" | "done">("idle");

  if (stage === "done") {
    return (
      <div className="rounded-[12px] border border-success/30 bg-success-bg p-4 text-center">
        <p className="text-2xl">✅</p>
        <p className="mt-1 font-bold text-ink">¡Postulación enviada!</p>
        <p className="mt-1 text-sm text-muted">
          La marca revisará tu perfil. Te avisaremos de cualquier novedad.
        </p>
      </div>
    );
  }

  if (stage === "form") {
    return (
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">
            Mensaje a la marca
          </span>
          <textarea
            rows={4}
            defaultValue="Hola, me encantaría colaborar. Mi audiencia encaja muy bien con vuestra marca y tengo ideas concretas para el contenido."
            className="w-full rounded-[10px] border border-line bg-surface p-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">
            Tu tarifa propuesta (€)
          </span>
          <input
            type="number"
            defaultValue={suggestedRate}
            className="h-11 w-full rounded-[10px] border border-line bg-surface px-3.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
          />
        </label>
        <div className="flex gap-2">
          <Button full onClick={() => setStage("done")}>
            Enviar postulación
          </Button>
          <Button variant="secondary" onClick={() => setStage("idle")}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button full onClick={() => setStage("form")}>
      Postularme a esta campaña
    </Button>
  );
}
