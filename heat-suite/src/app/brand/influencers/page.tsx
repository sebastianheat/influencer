import { CreatorsTable } from "@/components/CreatorsTable";
import { getCreators } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Creators() {
  const creators = await getCreators();
  return <CreatorsTable creators={creators} />;
}
