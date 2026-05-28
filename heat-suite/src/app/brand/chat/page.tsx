import { ChatList } from "@/components/ChatList";
import { getBrandConversations } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function BrandChat() {
  const convos = await getBrandConversations();
  return (
    <ChatList
      convos={convos}
      emptyLabel="Aún no hay creadores aceptados. Cuando aceptes una postulación se abre el chat acá."
    />
  );
}
