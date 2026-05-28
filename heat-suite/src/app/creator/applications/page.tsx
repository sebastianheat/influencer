import Link from "next/link";
import {
  ApplicationStatusBadge,
  Card,
  EmptyState,
  PageHeader,
} from "@/components/ui";
import { SubmitContentForm } from "@/components/SubmitContentForm";
import { currentCreatorId, getApplicationsForCreator } from "@/lib/queries";
import { dateShort, money } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { OdtStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const ODT_LABEL: Record<OdtStatus, { label: string; cls: string }> = {
  pending_payment: { label: "Esperando pago de la marca", cls: "bg-warning-bg text-warning" },
  paid: { label: "Entregar contenido", cls: "bg-accent-soft text-accent" },
  content_submitted: { label: "En evaluación", cls: "bg-accent-soft text-accent" },
  released: { label: "Pagada ✓", cls: "bg-success-bg text-success" },
  rejected: { label: "Rechazada", cls: "bg-danger-bg text-danger" },
};

export default async function CreatorApplications() {
  const me = await currentCreatorId();
  const apps = me ? await getApplicationsForCreator(me) : [];

  return (
    <>
      <PageHeader
        title="Mis postulaciones"
        subtitle="Sigue el estado de cada colaboración a la que te postulaste."
      />

      {apps.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Aún no te has postulado"
          subtitle="Explora campañas y postúlate a las que encajen contigo."
        />
      ) : (
        <Card padded={false}>
          <div className="divide-y divide-line">
            {apps.map(({ app, campaign }) => {
              const odt = app.odtStatus ? ODT_LABEL[app.odtStatus] : null;
              return (
                <div key={app.id} className="px-5 py-4">
                  <Link
                    href={`/creator/campaigns/${campaign.id}`}
                    className="flex flex-wrap items-center gap-4"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-card text-xl">
                      {campaign.brandLogo}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{campaign.title}</p>
                      <p className="text-xs text-dim">
                        {campaign.brand} · postulada el {dateShort(app.appliedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-ink">{money(app.creatorAmount ?? app.proposedRate)}</p>
                      <p className="text-[11px] text-dim">tu tarifa</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <ApplicationStatusBadge status={app.status} />
                      {odt && (
                        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold", odt.cls)}>
                          {odt.label}
                        </span>
                      )}
                    </div>
                  </Link>

                  {app.odtStatus === "paid" && (
                    <div className="mt-3 rounded-[10px] bg-soft p-3">
                      <p className="mb-2 text-xs font-semibold text-soft-ink">
                        Pegá el link de tu publicación de Instagram o TikTok:
                      </p>
                      <SubmitContentForm appId={app.id} />
                    </div>
                  )}

                  {app.odtStatus === "rejected" && app.rejectionReason && (
                    <p className="mt-3 rounded-[10px] bg-danger-bg p-3 text-xs text-danger">
                      Motivo: {app.rejectionReason}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </>
  );
}
