import { SettingsClient } from "./SettingsClient";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  let currentPlan = "none";
  if (session?.user?.id) {
    const brand = await prisma.brand.findUnique({
      where: { userId: session.user.id },
      select: { plan: true },
    });
    currentPlan = brand?.plan ?? "none";
  }
  return <SettingsClient currentPlan={currentPlan} />;
}
