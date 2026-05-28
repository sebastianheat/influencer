"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Determina si el user es el brand owner o el creador de la application.
async function authorizeChatAccess(applicationId: string): Promise<
  | { error: string; role?: undefined; userId?: undefined }
  | { role: "brand" | "creator"; userId: string }
> {
  const session = await auth();
  if (!session?.user?.id) return { error: "no_session" };
  const userId = session.user.id;
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      campaign: { include: { brand: true } },
      creator: true,
    },
  });
  if (!app) return { error: "not_found" };
  if (app.campaign.brand.userId === userId) return { role: "brand", userId };
  if (app.creator.userId === userId) return { role: "creator", userId };
  return { error: "forbidden" };
}

export async function sendMessage(applicationId: string, body: string) {
  const body0 = body.trim().slice(0, 2000);
  if (!body0) return { error: "empty" };
  const auth0 = await authorizeChatAccess(applicationId);
  if ("error" in auth0) return { error: auth0.error };

  // El sender marca como leído su propio lado al enviar.
  const senderRoleFields =
    auth0.role === "brand"
      ? { readByBrandAt: new Date() }
      : { readByCreatorAt: new Date() };

  const m = await prisma.message.create({
    data: {
      applicationId,
      senderId: auth0.userId,
      body: body0,
      ...senderRoleFields,
    },
  });
  return { ok: true, id: m.id };
}

export async function markMessagesRead(applicationId: string) {
  const auth0 = await authorizeChatAccess(applicationId);
  if ("error" in auth0) return { error: auth0.error };

  const field = auth0.role === "brand" ? "readByBrandAt" : "readByCreatorAt";
  await prisma.message.updateMany({
    where: {
      applicationId,
      [field]: null,
    },
    data: { [field]: new Date() },
  });
  return { ok: true };
}
