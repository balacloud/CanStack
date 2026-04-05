import { NextResponse } from "next/server";
import { type PlanTier, pricingPlansByTier } from "@/lib/pricing";
import { getStripe } from "@/lib/stripe";

function isPlanTier(value: string): value is PlanTier {
  return value in pricingPlansByTier;
}

export async function POST(request: Request) {
  try {
    const { tier, locale = "en" } = (await request.json()) as {
      locale?: string;
      tier?: string;
    };

    if (!tier || !isPlanTier(tier)) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 503 },
      );
    }

    const plan = pricingPlansByTier[tier];
    if (!plan.stripePriceId) {
      return NextResponse.json(
        { error: "Stripe price ID is missing." },
        { status: 503 },
      );
    }

    const origin =
      request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL;

    if (!origin) {
      return NextResponse.json(
        { error: "Missing application origin." },
        { status: 500 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      allow_promotion_codes: true,
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      success_url: `${origin}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed." },
      { status: 500 },
    );
  }
}
