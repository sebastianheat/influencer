import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export const PLAN_PRICE: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  plus: process.env.STRIPE_PRICE_PLUS,
};

export function planFromPriceId(priceId: string | undefined): string {
  if (!priceId) return "none";
  if (priceId === process.env.STRIPE_PRICE_STARTER) return "starter";
  if (priceId === process.env.STRIPE_PRICE_PLUS) return "plus";
  return "none";
}
