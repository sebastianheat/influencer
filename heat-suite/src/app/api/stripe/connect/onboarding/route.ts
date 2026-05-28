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
    const err = e as { message?: string; type?: string; code?: string };
    console.error("Stripe Connect onboarding error", {
      message: err?.message,
      type: err?.type,
      code: err?.code,
      raw: e,
    });
    const msg = encodeURIComponent(err?.message ?? "unknown");
    return NextResponse.redirect(
      new URL(
        `/creator/profile?error=stripe_onboarding&detail=${msg}`,
        origin,
      ),
    );
  }
}
