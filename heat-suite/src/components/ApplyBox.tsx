"use client";

import { useState } from "react";
import { Button } from "./ui";
import { applyToCampaign } from "@/lib/campaign-actions";

export function ApplyBox({
  campaignId,
  suggestedRate,
}: {
  campaignId: string;
  suggestedRate: number;
}) {
  const [stage, setStage] = useState<"idle" | "form" | "sending" | "done">("idle");
  const [message, setMessage] = useState(
    "Hola, me encantaría colaborar. Mi audiencia encaja muy bien con vuestra marca y tengo ideas concretas para el contenido.",
  );
  const [rate, setRate] = useState(suggestedRate);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setStage("sending");
    setError(null);
    const res = await applyToCampaign(campaignId, message, rate);
    if (res?.error) {
      setError(res.error);
      setStage("form");
    } else {
      setStage("done");
    }
  };

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

  if (stage === "form" || stage === "sending") {
    return (
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">
            Mensaje a la marca
          </span>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-[10px] border border-line bg-surface p-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-ink">
            Tu tarifa propuesta (CLP)
          </span>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="h-11 w-full rounded-[10px] border border-line bg-surface px-3.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
          />
        </label>
        {error && (
          <p className="rounded-[10px] bg-danger-bg px-3 py-2 text-sm font-semibold text-danger">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <Button full onClick={submit}>
            {stage === "sending" ? "Enviando…" : "Enviar postulación"}
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
