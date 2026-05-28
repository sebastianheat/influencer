"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { stripe, stripeConfigured } from "@/lib/stripe";
import {
  brandPriceFromCreatorRate,
  commissionFromBrandAmount,
} from "@/lib/stripe-connect";
import { currentBrandId, currentCreatorId } from "@/lib/queries";

async function origin() {
  const h = await headers();
  return (
    h.get("origin") ??
    (h.get("host") ? `https://${h.get("host")}` : "https://heat-suite.vercel.app")
  );
}

// Brand acepta la postulación → calcula montos y crea la ODT en "pending_payment".
export async function acceptApplication(appId: string) {
  const brandId = await currentBrandId();
  if (!brandId) return { error: "No autorizado" };

  const app = await prisma.application.findUnique({
    where: { id: appId },
    include: { campaign: true },
  });
  if (!app || app.campaign.brandId !== brandId) return { error: "No encontrado" };

  const creatorAmount = app.proposedRate;
  const brandAmount = brandPriceFromCreatorRate(creatorAmount);
  const commissionAmount = commissionFromBrandAmount(brandAmount, creatorAmount);

  await prisma.application.update({
    where: { id: appId },
    data: {
      status: "ACCEPTED",
      odtStatus: "pending_payment",
      brandAmount,
      creatorAmount,
      commissionAmount,
    },
  });
  revalidatePath(`/brand/campaigns/${app.campaignId}/postulantes`);
  return { ok: true };
}

// Brand paga la ODT vía Stripe Checkout (CLP, modo payment one-time).
export async function payOdt(appId: string) {
  const brandId = await currentBrandId();
  if (!brandId) redirect("/login");
  if (!stripeConfigured) redirect("/brand/campaigns?odt=stripe_unconfigured");

  const app = await prisma.application.findUnique({
    where: { id: appId },
    include: { campaign: true, creator: true },
  });
  if (!app || app.campaign.brandId !== brandId) redirect("/brand/campaigns");
  if (app.odtStatus !== "pending_payment" || !app.brandAmount) {
    redirect(`/brand/campaigns/${app!.campaignId}/postulantes?odt=invalid_state`);
  }

  const base = await origin();
  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "clp",
          product_data: {
            name: `ODT · ${app.campaign.title}`,
            description: `Colaboración con ${app.creator.handle}`,
          },
          unit_amount: app.brandAmount,
        },
        quantity: 1,
      },
    ],
    success_url: `${base}/brand/campaigns/${app.campaignId}/postulantes?odt=paid`,
    cancel_url: `${base}/brand/campaigns/${app.campaignId}/postulantes?odt=cancel`,
    metadata: {
      type: "odt",
      applicationId: app.id,
      campaignId: app.campaignId,
      brandId,
    },
  });

  await prisma.application.update({
    where: { id: app.id },
    data: { stripeCheckoutSessionId: checkout.id },
  });

  if (checkout.url) redirect(checkout.url);
  redirect(`/brand/campaigns/${app.campaignId}/postulantes?odt=error`);
}

// Creador envía el contenido entregado.
export async function submitContent(appId: string, contentUrl: string) {
  const creatorId = await currentCreatorId();
  if (!creatorId) return { error: "No autorizado" };

  const app = await prisma.application.findUnique({ where: { id: appId } });
  if (!app || app.creatorId !== creatorId) return { error: "No encontrado" };
  if (app.odtStatus !== "paid") return { error: "ODT no está pagada" };

  await prisma.application.update({
    where: { id: appId },
    data: {
      odtStatus: "content_submitted",
      contentUrl,
      contentSubmittedAt: new Date(),
    },
  });
  revalidatePath(`/creator/applications`);
  revalidatePath(`/brand/campaigns/${app.campaignId}/postulantes`);
  return { ok: true };
}

// Brand aprueba el contenido → transferencia al creador (rate) + Heat Suite se queda con la comisión.
export async function approveOdt(appId: string) {
  const brandId = await currentBrandId();
  if (!brandId) return { error: "No autorizado" };

  const app = await prisma.application.findUnique({
    where: { id: appId },
    include: {
      campaign: true,
      creator: { include: { user: { include: { connections: true } } } },
    },
  });
  if (!app || app.campaign.brandId !== brandId) return { error: "No encontrado" };
  if (app.odtStatus !== "content_submitted") return { error: "El contenido no está en evaluación" };
  if (!app.creatorAmount) return { error: "ODT sin monto" };

  const stripeConn = app.creator.user.connections.find((c) => c.provider === "stripe");
  if (!stripeConn?.externalId || !stripeConn.payoutsEnabled) {
    return { error: "El creador aún no completó su onboarding de Stripe" };
  }

  // HEAT Suite LLC es US → su settlement currency es USD. Cuando la marca paga en
  // CLP, Stripe convierte y nuestro balance crece en USD. Para transferir al
  // creador tenemos que usar la misma currency que el balance_transaction (USD)
  // y calcular el monto proporcional (creatorAmount / brandAmount del net USD).
  if (!app.stripePaymentIntentId || !app.brandAmount) {
    return { error: "Falta info del pago original" };
  }

  let transferAmount: number;
  let transferCurrency: string;
  let sourceTransaction: string | undefined;

  try {
    const pi = await stripe.paymentIntents.retrieve(app.stripePaymentIntentId, {
      expand: ["latest_charge.balance_transaction"],
    });
    const charge = pi.latest_charge;
    if (!charge || typeof charge === "string") {
      return { error: "No se pudo leer el cobro original" };
    }
    sourceTransaction = charge.id;
    const bt = charge.balance_transaction;
    if (!bt || typeof bt === "string") {
      return { error: "No se pudo leer balance_transaction" };
    }
    transferCurrency = bt.currency; // usd (o lo que sea el settlement)
    const ratio = app.creatorAmount / app.brandAmount; // ~0.85
    transferAmount = Math.floor(bt.net * ratio);
  } catch (e) {
    const err = e as { message?: string };
    console.error("Error leyendo charge/balance_transaction", err);
    return { error: err?.message ?? "Error leyendo cobro original" };
  }

  let transfer;
  try {
    transfer = await stripe.transfers.create({
      amount: transferAmount,
      currency: transferCurrency,
      destination: stripeConn.externalId,
      source_transaction: sourceTransaction,
      metadata: { applicationId: app.id, campaignId: app.campaignId },
    });
  } catch (e) {
    const err = e as { message?: string; type?: string; code?: string; raw?: { message?: string } };
    console.error("Stripe transfer error", {
      message: err?.message,
      type: err?.type,
      code: err?.code,
      raw: err?.raw,
      destination: stripeConn.externalId,
      amount: transferAmount,
      currency: transferCurrency,
      sourceTransaction,
    });
    return { error: err?.message ?? "Error al transferir" };
  }

  await prisma.application.update({
    where: { id: app.id },
    data: {
      odtStatus: "released",
      stripeTransferId: transfer.id,
      releasedAt: new Date(),
    },
  });
  revalidatePath(`/brand/campaigns/${app.campaignId}/postulantes`);
  return { ok: true };
}

// Brand rechaza el contenido → reembolso al saldo del brand (no a la tarjeta).
export async function rejectOdt(appId: string, reason: string) {
  const brandId = await currentBrandId();
  if (!brandId) return { error: "No autorizado" };

  const app = await prisma.application.findUnique({
    where: { id: appId },
    include: { campaign: true },
  });
  if (!app || app.campaign.brandId !== brandId) return { error: "No encontrado" };
  if (app.odtStatus !== "content_submitted") return { error: "El contenido no está en evaluación" };
  if (!app.brandAmount) return { error: "ODT sin monto" };

  const refund = app.brandAmount;
  await prisma.$transaction([
    prisma.application.update({
      where: { id: app.id },
      data: {
        odtStatus: "rejected",
        rejectedAt: new Date(),
        rejectionReason: reason.slice(0, 500),
      },
    }),
    prisma.brand.update({
      where: { id: brandId },
      data: { balance: { increment: refund } },
    }),
    prisma.brandBalanceTransaction.create({
      data: {
        brandId,
        amount: refund,
        reason: "refund_odt",
        applicationId: app.id,
      },
    }),
  ]);
  revalidatePath(`/brand/campaigns/${app.campaignId}/postulantes`);
  return { ok: true };
}
