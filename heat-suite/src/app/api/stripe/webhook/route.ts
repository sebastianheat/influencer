import type Stripe from "stripe";
import { stripe, planFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  async function syncSubscription(sub: Stripe.Subscription) {
    const customerId =
      typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const priceId = sub.items.data[0]?.price?.id;
    const plan =
      (sub.metadata?.plan as string) || planFromPriceId(priceId);
    const periodEnd = (sub as unknown as { current_period_end?: number })
      .current_period_end;
    await prisma.brand.updateMany({
      where: { stripeCustomerId: customerId },
      data: {
        subscriptionId: sub.id,
        subscriptionStatus: sub.status,
        plan: sub.status === "canceled" ? "none" : plan,
        currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      },
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        // Subscription (planes Heat Suite)
        if (s.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            s.subscription as string,
          );
          await syncSubscription(sub);
        }
        // ODT one-time payment
        const meta = s.metadata ?? {};
        if (
          s.mode === "payment" &&
          meta.type === "odt" &&
          typeof meta.applicationId === "string"
        ) {
          await prisma.application.updateMany({
            where: {
              id: meta.applicationId,
              odtStatus: "pending_payment",
            },
            data: {
              odtStatus: "paid",
              paidAt: new Date(),
              stripePaymentIntentId:
                typeof s.payment_intent === "string"
                  ? s.payment_intent
                  : (s.payment_intent?.id ?? null),
            },
          });
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      }
    }
  } catch (e) {
    console.error("Stripe webhook handler error", e);
    return new Response("handler error", { status: 500 });
  }

  return new Response("ok");
}
