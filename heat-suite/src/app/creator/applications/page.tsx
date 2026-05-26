import Link from "next/link";
import {
  ApplicationStatusBadge,
  Card,
  EmptyState,
  PageHeader,
} from "@/components/ui";
import { currentCreatorId, getApplicationsForCreator } from "@/lib/queries";
import { dateShort, money } from "@/lib/format";

export const dynamic = "force-dynamic";

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
            {apps.map(({ app, campaign }) => (
              <Link
                key={app.id}
                href={`/creator/campaigns/${campaign.id}`}
                className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-soft"
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
                  <p className="text-sm font-extrabold text-ink">{money(app.proposedRate)}</p>
                  <p className="text-[11px] text-dim">tu tarifa</p>
                </div>
                <ApplicationStatusBadge status={app.status} />
              </Link>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
