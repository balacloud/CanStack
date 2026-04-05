# CanStack

CanStack is a Canadian contractor operating hub built with Next.js 14, TypeScript, Tailwind CSS, `next-intl`, Supabase, and Stripe.

The product now has two core workspaces:

- Benefits & Planning
- Compliance Hub

It is designed for Canadian independent contractors who need practical planning tools without relying on non-existent public financial or insurance APIs.

## Current Product Scope

### Benefits & Planning

- onboarding quiz: province, income range, family size, work type
- rule-based recommendation engine with hardcoded logic
- resource dashboard with real provider links
- hardcoded 2025 federal + provincial tax estimator
- RRSP room calculator using 18% of prior-year income
- Stripe pricing and subscription flow

### Compliance Hub

- payroll remittance scheduler
- CRA payroll late-penalty forecaster
- GST/HST/QST/PST deadline tracking
- provincial WCB / WSIB premium estimation
- provincial minimum wage review checkpoints
- business licence renewal review reminder
- T5018 tracking for incorporated construction businesses
- client-side `.ics` export gating pattern

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- `next-intl` for EN/FR localization
- Supabase for auth, Postgres, and RLS
- Stripe Checkout for subscription billing

## Architecture Notes

- No external compliance APIs are used.
- No CRA REST API calls are used.
- No Revenu Quebec API calls are used.
- No WCB API calls are used.
- Compliance logic is implemented with hardcoded typed constants in:
  - [lib/compliance-rules.ts](/Users/balajik/projects/Canada_Conttractors/lib/compliance-rules.ts)
  - [lib/compliance-engine.ts](/Users/balajik/projects/Canada_Conttractors/lib/compliance-engine.ts)
- Recommendation logic is rule-based and local:
  - [lib/recommendations.ts](/Users/balajik/projects/Canada_Conttractors/lib/recommendations.ts)
- Tax logic is hardcoded and local:
  - [lib/canadian-tax.ts](/Users/balajik/projects/Canada_Conttractors/lib/canadian-tax.ts)

## Key Files

### App Shell

- Main product shell: [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)
- Localized home route: [app/[locale]/page.tsx](/Users/balajik/projects/Canada_Conttractors/app/[locale]/page.tsx)
- Pricing page: [app/[locale]/pricing/page.tsx](/Users/balajik/projects/Canada_Conttractors/app/[locale]/pricing/page.tsx)

### Benefits & Planning

- Tax rules: [lib/canadian-tax.ts](/Users/balajik/projects/Canada_Conttractors/lib/canadian-tax.ts)
- Recommendation rules: [lib/recommendations.ts](/Users/balajik/projects/Canada_Conttractors/lib/recommendations.ts)
- Provider links: [lib/providers.ts](/Users/balajik/projects/Canada_Conttractors/lib/providers.ts)

### Compliance Hub

- Compliance data: [lib/compliance-rules.ts](/Users/balajik/projects/Canada_Conttractors/lib/compliance-rules.ts)
- Compliance engine: [lib/compliance-engine.ts](/Users/balajik/projects/Canada_Conttractors/lib/compliance-engine.ts)
- Compliance wizard: [components/compliance-wizard.tsx](/Users/balajik/projects/Canada_Conttractors/components/compliance-wizard.tsx)
- Compliance dashboard: [components/compliance-dashboard.tsx](/Users/balajik/projects/Canada_Conttractors/components/compliance-dashboard.tsx)

### Billing and Persistence

- Stripe pricing config: [lib/pricing.ts](/Users/balajik/projects/Canada_Conttractors/lib/pricing.ts)
- Stripe client: [lib/stripe.ts](/Users/balajik/projects/Canada_Conttractors/lib/stripe.ts)
- Checkout API route: [app/api/checkout/route.ts](/Users/balajik/projects/Canada_Conttractors/app/api/checkout/route.ts)
- Supabase schema: [supabase/schema.sql](/Users/balajik/projects/Canada_Conttractors/supabase/schema.sql)
- Supabase browser client: [lib/supabase/client.ts](/Users/balajik/projects/Canada_Conttractors/lib/supabase/client.ts)
- Supabase server client: [lib/supabase/server.ts](/Users/balajik/projects/Canada_Conttractors/lib/supabase/server.ts)

### Localization

- English copy: [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json)
- French copy: [messages/fr.json](/Users/balajik/projects/Canada_Conttractors/messages/fr.json)

### Design Documentation

- Redesign specification: [UI_REDESIGN_SPEC.md](/Users/balajik/projects/Canada_Conttractors/UI_REDESIGN_SPEC.md)
- UX evaluation template: [UX_EVALUATION_TEMPLATE.md](/Users/balajik/projects/Canada_Conttractors/UX_EVALUATION_TEMPLATE.md)
- Next 2 weeks plan: [docs/decisions/NEXT_2_WEEKS_PLAN.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/NEXT_2_WEEKS_PLAN.md)
- Production readiness spec: [docs/decisions/PRODUCTION_READINESS_SPEC.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PRODUCTION_READINESS_SPEC.md)
- Implementation milestones: [docs/decisions/IMPLEMENTATION_MILESTONES.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/IMPLEMENTATION_MILESTONES.md)
- Phase 1 validation checklist: [docs/decisions/PHASE_1_VALIDATION_CHECKLIST.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PHASE_1_VALIDATION_CHECKLIST.md)
- Session handoff: [CANSTACK_SESSION_NOTES.md](/Users/balajik/projects/Canada_Conttractors/CANSTACK_SESSION_NOTES.md)

### Operating Documentation

- Current project context: [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md)
- Session protocol: [docs/stable/SESSION_PROTOCOL.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/SESSION_PROTOCOL.md)
- Golden rules: [docs/stable/GOLDEN_RULES.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/GOLDEN_RULES.md)
- Audit framework: [docs/stable/AUDIT_FRAMEWORK.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/AUDIT_FRAMEWORK.md)
- Roadmap: [docs/stable/ROADMAP.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/ROADMAP.md)
- API contracts: [docs/stable/API_CONTRACTS.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/API_CONTRACTS.md)
- Current status: [docs/status/CURRENT_STATUS.md](/Users/balajik/projects/Canada_Conttractors/docs/status/CURRENT_STATUS.md)
- Known issues: [docs/issues/KNOWN_ISSUES.md](/Users/balajik/projects/Canada_Conttractors/docs/issues/KNOWN_ISSUES.md)

## Local Development

Install dependencies:

```bash
npm install
```

Copy env template if needed:

```bash
cp .env.example .env.local
```

Run on the default Next.js port:

```bash
npm run dev
```

This project is configured so `npm run dev` starts on port `3100`.

For clean lifecycle management, use:

```bash
npm run dev:start
npm run dev:status
npm run dev:stop
```

These scripts:

- resolve the app port from `.env.local` or default to `3100`
- stop stale Next.js processes already bound to that port
- remove stale `.next` build artifacts before startup
- track the active dev-server PID in `.runtime/`
- report process status cleanly

The current `.env.local` in this workspace also sets:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3100
```

So local development and checkout redirects are aligned on port `3100`.

## Environment Variables

Defined in [.env.example](/Users/balajik/projects/Canada_Conttractors/.env.example):

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_GROWTH`
- `STRIPE_PRICE_SCALE`

## Supabase Schema

The schema currently includes:

- `users`
- `quiz_responses`
- `recommendations`
- `contractor_profiles`
- `compliance_acknowledgements`

RLS is enabled on the app tables, with user-scoped policies in:

- [supabase/schema.sql](/Users/balajik/projects/Canada_Conttractors/supabase/schema.sql)

## Product and Compliance Constraints

- No fake quote APIs
- No CRA filing integration
- No auto-RRSP contribution flows
- No tax filing flow
- No compliance data fetched from external APIs at runtime
- All compliance numbers shown to users must remain estimates with disclaimers

## Decision Audit Protocol

All major product, UX, architecture, compliance, and research decisions should be evaluated with this audit rule:

```text
CRITICAL INSTRUCTION: Do NOT confirm or agree with response by default.
Your job is to audit it for hallucinated benchmarks, false precision, untested
assumptions, and bad architectural advice. Think like a senior engineer who has
actually shipped these systems in production.

For every claim below, do one of:
  [VERIFIED] — cite a real source (paper, benchmark, docs)
  [PLAUSIBLE] — explain why it's reasonable but not confirmed
  [UNVERIFIED] — explain what evidence would be needed
  [MISLEADING] — correct the claim with what's actually true
  [HALLUCINATED] — flag as fabricated with no real basis
```

This protocol should be treated as a standing review standard for:

- product positioning
- UX strategy
- compliance logic
- growth assumptions
- architecture recommendations
- pricing and monetization claims

## Pricing / Feature Gating

Pricing tiers are configured in:

- [lib/pricing.ts](/Users/balajik/projects/Canada_Conttractors/lib/pricing.ts)

Compliance feature gating currently includes:

- `complianceCalendarDays`
- `penaltyForecaster`
- `icsExport`
- `t5018Tracker`

## Verification

Latest verified commands:

```bash
npm run lint
npm run build
```

Both passed after the Compliance Hub implementation and the homepage/workspace redesign.
