import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicantsManager } from "@/components/ApplicantsManager";
import { getApplicationsForCampaign, getCampaign } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Postulantes({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const rows = await getApplicationsForCampaign(campaign.id);

  return (
    <>
      <nav className="mb-4 flex items-center gap-2 text-sm text-soft-ink">
        <Link href="/brand/campaigns" className="hover:text-ink">
          Campañas
        </Link>
        <span className="text-dim">›</span>
        <Link href={`/brand/campaigns/${campaign.id}`} className="hover:text-ink">
          {campaign.title}
        </Link>
        <span className="text-dim">›</span>
        <span className="font-semibold text-accent">Postulantes</span>
      </nav>

      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Postulantes</h1>
      <p className="mb-6 mt-1 text-sm text-soft-ink">
        Revisa quién quiere participar y arma tu preselección.
      </p>

      <ApplicantsManager initial={rows} />
    </>
  );
}
