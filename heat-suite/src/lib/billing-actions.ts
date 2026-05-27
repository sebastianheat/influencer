"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe, PLAN_PRICE } from "@/lib/stripe";

async function origin() {
  const h = await headers();
  return (
    h.get("origin") ??
    (h.get("host") ? `https://${h.get("host")}` : "https://heat-suite.vercel.app")
  );
}

export async function startCheckout(plan: "starter" | "plus") {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const brand = await prisma.brand.findUnique({
    where: { userId: session.user.id },
  });
  if (!brand) redirect("/brand");

  const price = PLAN_PRICE[plan];
  if (!price) redirect("/brand/settings?billing=unconfigured");

  let customerId = brand.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email ?? undefined,
      name: brand.name,
      metadata: { brandId: brand.id },
    });
    customerId = customer.id;
    await prisma.brand.update({
      where: { id: brand.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const base = await origin();
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${base}/brand/settings?billing=success`,
    cancel_url: `${base}/brand/settings?billing=cancel`,
    subscription_data: { metadata: { brandId: brand.id, plan } },
    metadata: { brandId: brand.id, plan },
  });

  if (checkout.url) redirect(checkout.url);
  redirect("/brand/settings?billing=error");
}

export async function openBillingPortal() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const brand = await prisma.brand.findUnique({
    where: { userId: session.user.id },
  });
  if (!brand?.stripeCustomerId) redirect("/brand/settings");

  const base = await origin();
  const portal = await stripe.billingPortal.sessions.create({
    customer: brand.stripeCustomerId,
    return_url: `${base}/brand/settings`,
  });
  redirect(portal.url);
}
