import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createOnboardingLink } from "@/lib/stripe-connect";

export const dynamic = "force-dynamic";

// Stripe llama acá si el AccountLink expira durante el onboarding.
// Generamos uno nuevo y redirigimos.
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
  if (!conn?.externalId) {
    return NextResponse.redirect(new URL("/creator/profile", origin));
  }
  const url = await createOnboardingLink(conn.externalId, origin);
  return NextResponse.redirect(url);
}
