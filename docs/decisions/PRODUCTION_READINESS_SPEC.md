# Production Readiness Spec

Last updated: March 16, 2026

## Purpose

This document defines what "production ready" means for CanStack as a regulated-adjacent SaaS on the current stack.

It is not a launch promise.
It is a checklist and target architecture.

## Current Stack

- Next.js 14 App Router
- TypeScript
- `next-intl`
- Supabase Auth + Postgres + RLS
- Stripe Checkout
- Tailwind CSS
- Vercel deployment target

## Current Repo Audit

### App and Runtime

Verdict: [VERIFIED]

What is true now:

- The project builds successfully with `npm run lint` and `npm run build`.
- The project has clean local lifecycle scripts on port `3100`.
- The middleware is currently only handling locale routing in [middleware.ts](/Users/balajik/projects/Canada_Conttractors/middleware.ts).
- The Next config is currently minimal in [next.config.mjs](/Users/balajik/projects/Canada_Conttractors/next.config.mjs).
- There are currently no `app/**/error.tsx`, `app/**/global-error.tsx`, or `instrumentation.ts` files in the repo.

Implication:

- The product is deployable, but not yet operationally hardened.

### Billing

Verdict: [VERIFIED]

What is true now:

- Checkout session creation exists in [app/api/checkout/route.ts](/Users/balajik/projects/Canada_Conttractors/app/api/checkout/route.ts).
- There is no webhook-based subscription provisioning flow in the repo.

Why this matters:

- Stripe says webhooks are required and you cannot rely only on the Checkout landing page for fulfillment because customers are not guaranteed to visit that page.

Source:

- [Stripe Checkout fulfillment](https://docs.stripe.com/checkout/fulfillment)
- [Stripe webhooks](https://docs.stripe.com/webhooks?lang=node)

### Database and Auth

Verdict: [VERIFIED]

What is true now:

- Supabase is in use.
- RLS is already part of the app design and schema.
- Supabase docs state that RLS should be enabled for any tables in an exposed schema and that no data is accessible with the public anon key until policies exist.

Source:

- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

### Backups and Recovery

Verdict: [VERIFIED]

What is true:

- Supabase offers Point-in-Time Recovery, which allows restore to chosen points with up to seconds of granularity.

Source:

- [Supabase backups and PITR](https://supabase.com/docs/guides/platform/backups)

### Hosting and Domain

Verdict: [VERIFIED]

What is true:

- Vercel supports domains, DNS management, and SSL certificate workflows.

Source:

- [Vercel domains](https://vercel.com/docs/domains)

### Monitoring

Verdict: [VERIFIED]

What is true:

- Vercel Observability provides monitoring and analysis for project performance and traffic.
- The docs also expose logs, alerts, tracing, Web Analytics, and Speed Insights.

Source:

- [Vercel Observability](https://vercel.com/docs/observability)

### Privacy

Verdict: [VERIFIED]

What is true:

- OPC guidance says organizations must obtain meaningful consent for collection, use, and disclosure of personal information.
- Sensitive information generally requires express consent.
- Organizations should show key elements up front and use just-in-time notices where appropriate.

Source:

- [OPC Guidelines for obtaining meaningful consent](https://www.priv.gc.ca/en/privacy-topics/collecting-personal-information/consent/gl_omc_201805/)
- [OPC PIPEDA safeguards principle](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_safeguards/?wbdisable=true)
- [OPC privacy breach obligations](https://www.priv.gc.ca/en/report-a-concern/report-a-privacy-breach-at-your-organization/report-a-privacy-breach-at-your-business/)

## Production-Grade Target State

## 1. Hosting and Environments

Verdict: [VERIFIED]

Required:

- Production deploys on Vercel
- Preview deployments for pull requests / branches
- Separate environment variables for:
  - development
  - preview
  - production
- Custom production domain with SSL enabled

Source:

- [Vercel domains](https://vercel.com/docs/domains)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)

Recommended:

- Production branch protection
- Preview deployment protection for non-public branches
- Rollback-ready release flow

Verdict: [PLAUSIBLE]

Reasoning:

- These are standard production controls, but the exact branch workflow is a team decision.

## 2. Secrets and Configuration

Verdict: [VERIFIED]

Required:

- Only public values use `NEXT_PUBLIC_*`
- All secrets stored in Vercel environment variables
- No production secrets in `.env.local`
- Secret rotation plan for:
  - Stripe keys
  - Supabase service-role keys if introduced later

Source:

- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)

Current gap:

- [VERIFIED] The repo has only basic env documentation and no documented rotation runbook.

## 3. Error Handling and Exception Management

Verdict: [VERIFIED]

Required:

- `error.tsx` for route-level failures
- `global-error.tsx` for root-level failures
- `not-found.tsx`
- centralized logging for server exceptions
- instrumentation for request/runtime visibility

Source:

- [Next.js error handling](https://nextjs.org/docs/app/getting-started/error-handling)
- [Next.js instrumentation](https://nextjs.org/docs/app/guides/instrumentation)

Current gap:

- [VERIFIED] These files are not present in the current repo.

## 4. Security Headers and Browser Hardening

Verdict: [VERIFIED]

Required:

- Content Security Policy
- `X-Frame-Options` or equivalent frame-ancestors protection
- `Referrer-Policy`
- `X-Content-Type-Options`
- restrictive permissions policy where appropriate
- no unnecessary public source maps in production

Source:

- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)

Current gap:

- [VERIFIED] [next.config.mjs](/Users/balajik/projects/Canada_Conttractors/next.config.mjs) is effectively empty, so these controls are not yet configured in app code.

## 5. Auth and Database Safety

Verdict: [VERIFIED]

Required:

- RLS on all exposed tables
- policy review for every new table
- migration discipline for schema changes
- no direct client access to privileged data

Source:

- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

Recommended:

- auto-enable or enforce RLS review during migrations
- explicit separation between anon-safe reads and server-only operations

Verdict: [PLAUSIBLE]

Reasoning:

- This is the natural operational extension of Supabase's RLS model.

## 6. Backup, Recovery, and Change Safety

Verdict: [VERIFIED]

Required:

- Daily backups at minimum
- PITR enabled before public launch if paid users are onboarded
- tested restore runbook

Source:

- [Supabase backups and PITR](https://supabase.com/docs/guides/platform/backups)

Current gap:

- [UNVERIFIED] The repo does not show whether PITR is enabled in the Supabase project.
- Needs:
  - dashboard confirmation
  - restore ownership and runbook

## 7. Network and Access Restrictions

Verdict: [VERIFIED]

What is true:

- Supabase network restrictions can restrict Postgres and pooler access by CIDR.
- They do not currently restrict Supabase HTTPS APIs like PostgREST/Auth/Storage.

Source:

- [Supabase network restrictions](https://supabase.com/docs/guides/platform/network-restrictions)

Recommended:

- restrict direct DB access to trusted IP ranges if using external admin access

Verdict: [PLAUSIBLE]

Reasoning:

- Useful for limiting administrative exposure, but actual value depends on how the team accesses the database.

## 8. Billing and Subscription State

Verdict: [VERIFIED]

Required:

- Stripe webhook endpoint
- signature verification
- subscription/customer state persisted in database
- idempotent billing event handling

Source:

- [Stripe webhooks](https://docs.stripe.com/webhooks?lang=node)
- [Stripe Checkout fulfillment](https://docs.stripe.com/checkout/fulfillment)

Current gap:

- [VERIFIED] Checkout exists, but webhook-driven provisioning and subscription state sync do not.

## 9. API and Abuse Protection

Verdict: [PLAUSIBLE]

Required target:

- rate limiting for public POST endpoints
- origin validation for checkout requests
- request payload validation on all route handlers

Reasoning:

- This is standard API hardening for internet-facing forms and billing routes.
- The exact package or provider can vary.

Current gap:

- [VERIFIED] The checkout route validates the requested plan tier, but there is no explicit rate limiting or documented origin allowlist policy in the repo.

## 10. Observability and Alerting

Verdict: [VERIFIED]

Required:

- runtime logs
- deploy logs
- request/error visibility
- performance monitoring
- alerting for critical failures

Source:

- [Vercel Observability](https://vercel.com/docs/observability)

Recommended:

- one owner for alert triage
- one documented severity ladder

Verdict: [PLAUSIBLE]

Reasoning:

- Monitoring without ownership is incomplete operationally.

## 11. Testing and Release Quality

Verdict: [PLAUSIBLE]

Required target:

- unit tests for deterministic compliance logic
- integration tests for checkout route
- end-to-end smoke tests for:
  - locale routing
  - pricing
  - compliance wizard
  - auth-gated persistence
- CI gates for:
  - install
  - lint
  - build
  - tests

Reasoning:

- These are the minimum practical quality gates for a SaaS with billing and compliance logic.
- The exact tool choices are not mandated by official platform docs.

Suggested tools:

- Vitest or Jest for unit tests
- Playwright for end-to-end tests
- GitHub Actions for CI

## 12. Privacy and Data Governance

Verdict: [VERIFIED]

Required:

- privacy policy
- meaningful consent before collecting profile/quiz data
- clear disclosure of what is collected and why
- data minimization
- retention/deletion rules
- breach response runbook

Source:

- [OPC meaningful consent](https://www.priv.gc.ca/en/privacy-topics/collecting-personal-information/consent/gl_omc_201805/)
- [OPC privacy breach reporting](https://www.priv.gc.ca/en/report-a-concern/report-a-privacy-breach-at-your-organization/report-a-privacy-breach-at-your-business/)
- [OPC safeguards principle](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_safeguards/?wbdisable=true)

Current gap:

- [PLAUSIBLE] The product design is PIPEDA-aware, but the repo does not show a complete production privacy/compliance layer yet.

## 13. Domain, Email, and Trust Infrastructure

Verdict: [PLAUSIBLE]

Required target:

- production domain
- transactional email sender domain
- SPF/DKIM/DMARC for outbound email
- support/privacy contact addresses

Reasoning:

- These are standard trust and deliverability requirements for public SaaS.
- Exact provider choice is not fixed by the current stack.

Suggested baseline:

- web: Vercel custom domain
- DNS: Vercel DNS or external DNS provider
- email: verified sender domain through a transactional email provider

## 14. Design and UX Production Standards

Verdict: [PLAUSIBLE]

Required target:

- consistent mobile and desktop behavior
- explicit empty, loading, and error states
- clear estimate disclaimers adjacent to every penalty/premium output
- stable workspace entry model
- accessible forms and touch targets

Reasoning:

- These are necessary for trust in a tax/compliance-adjacent SaaS, but the exact thresholds are product-specific.

## Launch Checklist

### Must Have Before Public Paid Launch

- custom production domain with SSL
- production environment variables configured
- Stripe webhook flow implemented
- subscription state persisted
- RLS review completed
- backups and PITR confirmed
- privacy policy and consent flow in place
- route-level and global error handling
- logging and alerting enabled
- lint and build green in CI

### Should Have Before Public Paid Launch

- end-to-end smoke tests
- security headers and CSP
- rate limiting on public POST routes
- restore runbook
- incident runbook
- analytics for first-click and funnel drop-off

### Nice to Have

- external error tracker
- on-call rotation
- automated compliance-source review workflow

## Missing Items You Should Explicitly Decide

- domain name and registrar/DNS owner
- production support email
- incident owner
- privacy officer contact
- backup owner
- release approver
- whether Vercel alone is sufficient or an external WAF/CDN layer is desired

## Recommended Build Order

1. UX validation and audience lock
2. compliance data hardening
3. privacy/legal docs and consent flow
4. Stripe webhooks and subscription sync
5. error handling and observability
6. security headers and route hardening
7. tests and CI
8. domain/email/final launch prep
