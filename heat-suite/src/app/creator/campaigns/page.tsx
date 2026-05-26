import { CreatorCampaignsBrowser } from "@/components/CreatorCampaignsBrowser";
import { getCampaigns } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CreatorCampaigns() {
  const campaigns = (await getCampaigns()).filter(
    (c) => c.status === "active" || c.status === "review",
  );
  return <CreatorCampaignsBrowser campaigns={campaigns} />;
}
