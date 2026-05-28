import { stripe } from "./stripe";
import { prisma } from "./prisma";

// 15% comisión Heat Suite (oculta al creador y a la marca)
export const COMMISSION_RATE = 0.15;

// Lo que paga la marca para que el creador reciba `creatorAmount` neto.
// Redondeamos al entero superior para no quedar cortos.
export function brandPriceFromCreatorRate(creatorAmount: number): number {
  return Math.ceil(creatorAmount / (1 - COMMISSION_RATE));
}

export function commissionFromBrandAmount(brandAmount: number, creatorAmount: number): number {
  return brandAmount - creatorAmount;
}

// Crea o recupera la cuenta Express del creador.
export async function ensureCreatorStripeAccount(
  userId: string,
  email: string | null,
): Promise<string> {
  const existing = await prisma.connection.findUnique({
    where: { userId_provider: { userId, provider: "stripe" } },
  });
  if (existing?.externalId) return existing.externalId;

  const account = await stripe.accounts.create({
    type: "express",
    email: email ?? undefined,
    capabilities: {
      transfers: { requested: true },
    },
    metadata: { userId },
  });

  await prisma.connection.upsert({
    where: { userId_provider: { userId, provider: "stripe" } },
    create: {
      userId,
      provider: "stripe",
      externalId: account.id,
    },
    update: { externalId: account.id },
  });

  return account.id;
}

// Genera el AccountLink que lleva al onboarding hosted de Stripe.
export async function createOnboardingLink(
  accountId: string,
  origin: string,
): Promise<string> {
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/api/stripe/connect/refresh`,
    return_url: `${origin}/api/stripe/connect/return`,
    type: "account_onboarding",
  });
  return link.url;
}

// Refresca el estado del account desde Stripe y guarda en DB.
export async function syncAccountStatus(userId: string): Promise<void> {
  const conn = await prisma.connection.findUnique({
    where: { userId_provider: { userId, provider: "stripe" } },
  });
  if (!conn?.externalId) return;

  const account = await stripe.accounts.retrieve(conn.externalId);
  await prisma.connection.update({
    where: { id: conn.id },
    data: {
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    },
  });
}

// Login link al dashboard de Express (para que el creador edite sus datos / vea pagos).
export async function createDashboardLink(accountId: string): Promise<string> {
  const link = await stripe.accounts.createLoginLink(accountId);
  return link.url;
}
