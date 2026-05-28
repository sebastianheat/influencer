import { ChatList } from "@/components/ChatList";
import { getCreatorConversations } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CreatorChat() {
  const convos = await getCreatorConversations();
  return (
    <ChatList
      convos={convos}
      emptyLabel="Aún no tenés ODT activas. Cuando una marca acepte tu postulación se abre el chat acá."
    />
  );
}
