export const pricingPlans = [
  {
    tier: "starter",
    name: "Starter",
    priceCad: "$49/mo CAD",
    stripePriceId: process.env.STRIPE_PRICE_STARTER ?? "",
    description: "Core dashboard, calculators, and 3 recommendation slots.",
    features: [
      "Onboarding quiz and dashboard",
      "Tax and RRSP estimate",
      "Affiliate provider resource hub",
    ],
    complianceFeatures: {
      complianceCalendarDays: 30,
      penaltyForecaster: true,
      icsExport: false,
      t5018Tracker: false,
    },
  },
  {
    tier: "growth",
    name: "Growth",
    priceCad: "$99/mo CAD",
    stripePriceId: process.env.STRIPE_PRICE_GROWTH ?? "",
    description: "Adds saved recommendation history and deeper resource comparisons.",
    features: [
      "Everything in Starter",
      "Expanded recommendation detail",
      "Priority support for plan setup",
    ],
    complianceFeatures: {
      complianceCalendarDays: 365,
      penaltyForecaster: true,
      icsExport: true,
      t5018Tracker: true,
    },
  },
  {
    tier: "scale",
    name: "Scale",
    priceCad: "$149/mo CAD",
    stripePriceId: process.env.STRIPE_PRICE_SCALE ?? "",
    description: "For incorporated contractors managing family coverage and advisors.",
    features: [
      "Everything in Growth",
      "Team and spouse planning notes",
      "Advanced scenario exports",
    ],
    complianceFeatures: {
      complianceCalendarDays: 365,
      penaltyForecaster: true,
      icsExport: true,
      t5018Tracker: true,
    },
  },
] as const;

export type PlanTier = (typeof pricingPlans)[number]["tier"];

export const pricingPlansByTier = Object.fromEntries(
  pricingPlans.map((plan) => [plan.tier, plan]),
) as Record<PlanTier, (typeof pricingPlans)[number]>;
