import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createOnboardingLink,
  ensureCreatorStripeAccount,
} from "@/lib/stripe-connect";
import { stripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", origin));
  }
  if (!stripeConfigured) {
    return NextResponse.redirect(
      new URL("/creator/profile?error=stripe_unconfigured", origin),
    );
  }
  try {
    const accountId = await ensureCreatorStripeAccount(
      session.user.id,
      session.user.email ?? null,
    );
    const url = await createOnboardingLink(accountId, origin);
    return NextResponse.redirect(url);
  } catch (e) {
    console.error("Stripe Connect onboarding error", e);
    return NextResponse.redirect(
      new URL("/creator/profile?error=stripe_onboarding", origin),
    );
  }
}
