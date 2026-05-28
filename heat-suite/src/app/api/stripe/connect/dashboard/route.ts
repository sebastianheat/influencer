import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createDashboardLink } from "@/lib/stripe-connect";

export const dynamic = "force-dynamic";

// Genera un login link al dashboard Express del creador.
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", origin));
  }
  const conn = await prisma.connection.findUnique({
    where: {
      userId_provider: { userId: session.user.id, provider: "stripe" },
    },
  });
  if (!conn?.externalId || !conn.detailsSubmitted) {
    return NextResponse.redirect(new URL("/creator/profile", origin));
  }
  const url = await createDashboardLink(conn.externalId);
  return NextResponse.redirect(url);
}
