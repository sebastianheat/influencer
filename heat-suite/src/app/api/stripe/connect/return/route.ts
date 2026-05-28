import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { syncAccountStatus } from "@/lib/stripe-connect";

export const dynamic = "force-dynamic";

// Stripe redirige acá cuando el creador termina (o abandona) el onboarding.
// Refrescamos el estado y volvemos al perfil.
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", origin));
  }
  try {
    await syncAccountStatus(session.user.id);
  } catch (e) {
    console.error("Stripe Connect sync error", e);
  }
  return NextResponse.redirect(
    new URL("/creator/profile?stripe=connected", origin),
  );
}
