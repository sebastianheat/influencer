import Stripe from "stripe";

// Fallback placeholder so importing this module never throws when the key is
// not yet configured; real API calls only run when a button is used.
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_not_configured",
);

export const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

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
