import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const updated = await prisma.brand.updateMany({
    where: { name: "Nueva Isapre — Cotiza tu plan de salud en 30 segundos" },
    data: { name: "Nueva Isapre" },
  });
  return NextResponse.json({ updated: updated.count });
}
