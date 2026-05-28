"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ApplicationStatusBadge,
  Avatar,
  Badge,
  Button,
  PlatformChips,
} from "./ui";
import type { Application, Influencer, OdtStatus } from "@/lib/types";
import { compact, dateShort, money } from "@/lib/format";
import { cn } from "@/lib/cn";
import { updateApplicationStatus } from "@/lib/campaign-actions";
import {
  acceptApplication,
  approveOdt,
  payOdt,
  rejectOdt,
} from "@/lib/odt-actions";
import { OdtBanner } from "./OdtBanner";

type Row = { app: Application; inf: Influencer };

function OdtBadge({ status }: { status: OdtStatus }) {
  const map: Record<OdtStatus, { label: string; cls: string }> = {
    pending_payment: { label: "Pendiente de pago", cls: "bg-warning-bg text-warning" },
    paid: { label: "Generando contenido", cls: "bg-accent-soft text-accent" },
    content_submitted: { label: "En evaluación", cls: "bg-accent-soft text-accent" },
    released: { label: "Finalizada · pagada", cls: "bg-success-bg text-success" },
    rejected: { label: "Rechazada", cls: "bg-danger-bg text-danger" },
  };
  const v = map[status];
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold", v.cls)}>
      {v.label}
    </span>
  );
}

export function ApplicantsManager({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [tab, setTab] = useState<"all" | "pending" | "shortlisted" | "accepted">(
    "all",
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ status: string; n: number } | null>(null);
  const [, startTransition] = useTransition();

  const patch = (appId: string, p: Partial<Application>) => {
    setRows((rs) =>
      rs.map((r) => (r.app.id === appId ? { ...r, app: { ...r.app, ...p } } : r)),
    );
  };

  const setStatus = (appId: string, status: Application["status"]) => {
    patch(appId, { status });
    void updateApplicationStatus(appId, status);
  };

  const accept = (appId: string) => {
    setBusy(appId);
    startTransition(async () => {
      const r = await acceptApplication(appId);
      setBusy(null);
      if (r?.ok) patch(appId, { status: "accepted", odtStatus: "pending_payment" });
    });
  };

  const reject = async (appId: string) => {
    const reason = window.prompt("Motivo del rechazo (opcional):") ?? "";
    setBusy(appId);
    const r = await rejectOdt(appId, reason);
    setBusy(null);
    if (r?.ok) {
      patch(appId, { odtStatus: "rejected", rejectionReason: reason });
      setFeedback((f) => ({ status: "rejected_refunded", n: (f?.n ?? 0) + 1 }));
    } else alert("Error: " + (r?.error ?? "desconocido"));
  };

  const approve = async (appId: string) => {
    setBusy(appId);
    const r = await approveOdt(appId);
    setBusy(null);
    if (r?.ok) {
      patch(appId, { odtStatus: "released" });
      setFeedback((f) => ({ status: "approved", n: (f?.n ?? 0) + 1 }));
    } else alert("Error: " + (r?.error ?? "desconocido"));
  };

  const tabs = [
    { key: "all" as const, label: "Todas" },
    { key: "pending" as const, label: "Pendientes" },
    { key: "shortlisted" as const, label: "Preseleccionados" },
    { key: "accepted" as const, label: "Aceptados" },
  ];

  const visible = rows.filter((r) => tab === "all" || r.app.status === tab);

  return (
    <div>
      {feedback && <OdtBanner key={`${feedback.status}-${feedback.n}`} status={feedback.status} />}
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const count =
            t.key === "all"
              ? rows.length
              : rows.filter((r) => r.app.status === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                tab === t.key
                  ? "bg-accent text-white"
                  : "border border-line bg-surface text-muted hover:border-line-strong",
              )}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <p className="rounded-[12px] border border-dashed border-line-strong bg-soft py-10 text-center text-sm text-soft-ink">
            No hay postulaciones en este estado.
          </p>
        )}
        {visible.map(({ app, inf }) => {
          const isBusy = busy === app.id;
          return (
            <div
              key={app.id}
              className="rounded-[14px] border border-line bg-surface p-4 shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-wrap items-start gap-4">
                <Avatar name={inf.name} size={48} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/brand/influencers/${inf.id}`}
                      className="font-bold text-ink hover:text-accent"
                    >
                      {inf.name}
                    </Link>
                    {inf.verified && <Badge tone="accent">✓ Verificado</Badge>}
                    <ApplicationStatusBadge status={app.status} />
                    {app.odtStatus && <OdtBadge status={app.odtStatus} />}
                  </div>
                  <p className="text-xs text-dim">
                    {inf.handle} · {inf.location} · {dateShort(app.appliedAt)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-soft-ink">
                    <span>
                      <strong className="text-ink">{compact(inf.followers)}</strong>{" "}
                      seguidores
                    </span>
                    <span>
                      <strong className="text-ink">{inf.engagement}%</strong>{" "}
                      engagement
                    </span>
                    <span>⭐ {inf.rating}</span>
                    <PlatformChips platforms={inf.platforms} />
                  </div>
                  {app.message && (
                    <p className="mt-3 rounded-[10px] bg-soft p-3 text-sm text-muted">
                      “{app.message}”
                    </p>
                  )}
                  {app.contentUrl && (
                    <a
                      href={app.contentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                    >
                      🎬 Ver contenido entregado →
                    </a>
                  )}
                  {app.rejectionReason && (
                    <p className="mt-3 rounded-[10px] bg-danger-bg p-3 text-xs text-danger">
                      Motivo del rechazo: {app.rejectionReason}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-extrabold text-ink">
                    {money(app.brandAmount ?? app.proposedRate)}
                  </span>
                  <span className="text-[11px] text-dim">
                    {app.brandAmount ? "total" : "tarifa propuesta"}
                  </span>
                </div>
              </div>

              {/* Estados pre-aceptación */}
              {app.status !== "accepted" && app.status !== "rejected" && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
                  <Button size="sm" onClick={() => accept(app.id)} disabled={isBusy}>
                    {isBusy ? "Aceptando…" : "✓ Aceptar"}
                  </Button>
                  {app.status !== "shortlisted" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setStatus(app.id, "shortlisted")}
                    >
                      ★ Preseleccionar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setStatus(app.id, "rejected")}
                  >
                    Rechazar
                  </Button>
                </div>
              )}

              {/* ODT pendiente de pago */}
              {app.status === "accepted" && app.odtStatus === "pending_payment" && (
                <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-line pt-3">
                  <span className="text-sm font-semibold text-warning">
                    💳 Listo para pagar
                  </span>
                  <form
                    action={payOdt.bind(null, app.id)}
                    className="ml-auto"
                  >
                    <Button size="sm" type="submit">
                      Pagar ODT
                    </Button>
                  </form>
                </div>
              )}

              {/* ODT pagada, esperando contenido */}
              {app.status === "accepted" && app.odtStatus === "paid" && (
                <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-sm font-semibold text-accent">
                  ⏳ Esperando que el creador entregue el contenido.
                </div>
              )}

              {/* Contenido en evaluación */}
              {app.status === "accepted" && app.odtStatus === "content_submitted" && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                  <span className="text-sm font-semibold text-accent">
                    📋 Revisá y aprobá (o rechazá) el contenido
                  </span>
                  <div className="ml-auto flex gap-2">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => reject(app.id)}
                      disabled={isBusy}
                    >
                      Rechazar
                    </Button>
                    <Button size="sm" onClick={() => approve(app.id)} disabled={isBusy}>
                      Aprobar y pagar
                    </Button>
                  </div>
                </div>
              )}

              {/* Finalizada */}
              {app.status === "accepted" && app.odtStatus === "released" && (
                <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-sm font-semibold text-success">
                  ✓ Pago liberado al creador
                </div>
              )}

              {/* Rechazada — devuelta al saldo */}
              {app.odtStatus === "rejected" && (
                <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-sm font-semibold text-danger">
                  ↩︎ Reembolsada a tu saldo Heat Suite
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
