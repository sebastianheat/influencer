import { CreatorsTable } from "@/components/CreatorsTable";
import { influencers } from "@/lib/data";

export default function Creators() {
  return <CreatorsTable creators={influencers} />;
}
