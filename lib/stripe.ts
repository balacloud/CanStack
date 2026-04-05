import Stripe from "stripe";

export function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    return null;
  }

  return new Stripe(apiKey, {
    apiVersion: "2026-02-25.clover",
    typescript: true,
  });
}
