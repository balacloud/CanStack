# Strategy Snapshot — CanStack
Snapshot date: 2026-10-20 · Last commit: f59b30a (at time of writing) · Branch: main

## Purpose (one line)
A Canadian contractor operating platform: tax estimates, benefits planning, and payroll/sales-tax/WCB/T5018 deadline tracking for self-employed operators.

## What's built (by module: tax engine, compliance engine, wizard/dashboard, source monitor, admin, Stripe, i18n, Supabase)
- **Tax engine** (`lib/canadian-tax.ts`, 233 lines): 2025 + 2026 federal/provincial brackets, BPA credit with phase-out, year-aware RRSP room with annual cap.
- **Compliance engine** (`lib/compliance-rules.ts` 395 lines of hardcoded constants; `lib/compliance-engine.ts` 468 lines): payroll remittance calendar and penalty schedule, GST/HST/PST/QST calendars, QST quick method, WCB/WSIB premiums, provincial minimum wages, T5018.
- **Wizard/dashboard**: `components/compliance-wizard.tsx`, `compliance-dashboard.tsx`; planning workspace plus recommendations in `components/canstack-app.tsx`.
- **Source monitor + admin**: `data_sources` / `source_snapshots` / `audit_log` tables, 4 admin API routes (list/add, single check, check-all, audit log), admin dashboard, login page, and `/en/admin`.
- **Stripe**: subscription Checkout session route (`app/api/checkout`). No webhook handler, no subscription sync.
- **i18n**: next-intl, `en` + `fr`, 117-line message files each.
- **Supabase**: `supabase/schema.sql` with 8 tables (users, quiz_responses, recommendations, contractor_profiles, compliance_acknowledgements, plus the 3 above); server, client and service-role clients.

## What changed since April 10, 2026 (code, not docs)
- 2026-04-10 `86051f7`: admin login page; unauthenticated admin requests now redirect to login; `dotenv` dev dependency added.
- 2026-10-02 `c3cebaf`: fixed federal BPA phase-out thresholds in `lib/canadian-tax.ts` (2025: $177,882; 2026: $181,440, per CRA).
- 2026-10-09 `b3761b8`: 27 finance-education source rows added to `scripts/seed-sources.ts` (now 59 rows). **Committed but never seeded**, because Supabase is unreachable.
- 2026-10-20 `f59b30a`: stopped tracking a third party's resume and copyrighted transcripts; added both to `.gitignore`.
- Nothing else in `app/`, `components/` or `lib/` has changed.

## Verification (lint / build / tests: exact results and counts)
- `npm run lint` (2026-10-20): passed, 0 warnings, 0 errors.
- `npm run build` (2026-10-20): passed (exit 0).
- Tests: **none**. `package.json` has no test script and the repo has 0 test files.

## Live status (public URL? deployed commit? Supabase live? Stripe test or live mode?)
- Public URL: UNKNOWN. No deploy config (`.vercel`, etc.) or production URL is in the repo.
- Deployed commit: UNKNOWN.
- Supabase: **not reachable**. The project hostname does not resolve in DNS (first seen 2026-10-08, still the case 2026-10-20). Whether it was paused or deleted is UNKNOWN.
- Stripe mode (test or live): UNKNOWN; the key wasn't inspected. Price IDs come from env vars.
- GitHub repo: **public** as of 2026-10-20. The removed personal and copyrighted files remain in git history.

## Users, traffic, revenue (actual numbers, or "none")
- No analytics instrumented; no user, traffic or revenue data in the repo. Actual numbers: UNKNOWN.

## Monetization as coded (plans and prices in lib/pricing.ts; affiliate or provider links in lib/providers.ts and lib/recommendations.ts; which are real affiliate links vs plain URLs)
- **Plans** (`lib/pricing.ts`): Starter $49/mo CAD, Growth $99/mo CAD, Scale $149/mo CAD. `docs/decisions/Monitization.md` assumed **$29/mo**, so code and docs disagree.
- **Provider links** (`lib/providers.ts`): GreenShield (health/dental), Edge Benefits (disability/health/critical illness), Zensurance (commercial insurance).
- **Recommendation links** (`lib/recommendations.ts`): the same three providers, in a field named `affiliateLink`.
- **All of these are plain homepage URLs.** None is a real affiliate link: no tracking IDs and no affiliate network.
- **UI copy overstates this:** `messages/en.json` says "real affiliate destinations", and the Starter plan lists an "Affiliate provider resource hub".

## Data accuracy (source monitor: number of sources, last check date, sources failing; remaining TODO or unverified compliance values)
- **Sources:** 32 seeded on 2026-04-10; 59 in the seed file now (27 not seeded).
- **Last check date:** UNKNOWN (the database can't be reached).
- **Sources failing:** UNKNOWN now. Some WCB URLs were erroring at the last known check.
- **Values still TODO or unverified:**
  - AB WCB construction and professional rates: still 2025 data.
  - BC WCB 4.11% / 0.17%: labelled 2026 but not independently verified.
  - WSIB IT/professional class: code is TODO; correctly hidden from users.
  - NT, NU and YT minimum wages: null / TODO.
  - ON and QC minimum wages: TODO notes.
- **Stale review dates:** the 2026-04-01 and 2026-10-01 review dates on several provincial minimum wages have passed, and the values haven't been updated.

## Legal and compliance gaps (privacy policy, terms, consent checkbox, disclaimers, licences needed for any insurance referrals)
- **Privacy policy:** none (no page or route).
- **Terms of service:** none.
- **Consent checkbox:** none anywhere in the app.
- **Disclaimers:** present. Compliance outputs say "Estimate only … not tax advice"; tax and RRSP cards have estimate disclaimers.
- **Insurance referral licences:**
  - Health and disability referral commissions need a licence (LLQP in Ontario, per `Monitization.md`).
  - Zensurance (P&C) through Fintel Connect is described as open to publishers without a licence, but that's Perplexity's research and wasn't independently verified.
  - No referral income is currently coded.

## Umbrella-org status (finance-education product, insurance aggregator: anything built beyond docs?)
- **Finance-education:** no app, site or domain. It exists as WhatsApp post drafts (`docs/content-drafts/`), a Claude skill, and private Claude artifacts. Locked 2026-10-13 as traffic-pull only, not monetized.
- **Insurance aggregator:** nothing built. It needs a licence first.

## Rules engine readiness (could compliance-rules.ts and canadian-tax.ts be exposed as an API or MCP server? what's missing: tests, versioning, effective dates, source citations per value)
- **What helps:** both files are pure, deterministic TypeScript with no I/O, so they could be wrapped as an API or MCP server.
- **Tests:** none.
- **Versioning:** none for the rule set; no version stamp on outputs.
- **Effective dates:** only on minimum wages (14 fields). Tax brackets are keyed by year; rates and deadlines carry no effective dates.
- **Source citations:** uneven. WCB/WSIB/T5018 values have source names (mostly text, not URLs); tax constants have only code comments.
- **Ownership:** no machine-readable "verified" flag except on WSIB.

## Open decisions
1. Git history: make the repo private (planned 2026-10-21) and/or rewrite history to purge the files.
2. Price point: $49/$99/$149 (code) vs $29 (monetization audit).
3. Supabase: restore the existing project or recreate it, and whether the source monitor stays on it.
4. Insurance links: keep as informational (not monetized) or remove; whether to pursue Zensurance through Fintel Connect.
5. Phase 1 UX scorecard: run it, or explicitly defer it (named the priority 3 times without being run).

## Known risks
- Personal data and copyrighted content remain readable in a public repo's git history.
- No tests on tax or compliance logic. The BPA threshold bug (fixed 2026-10-02) went unnoticed for about 6 months.
- Minimum wages past their review dates mean users may see outdated values.
- UI copy claims "affiliate" links that don't exist, which is a trust and disclosure problem.
- `messages/en.json` still says "2025 … bracket logic" though the engine also does 2026.
- No privacy policy or terms, while the app collects quiz and profile data in Supabase tables.
- Supabase is down, so admin and source monitoring are inoperative.

## Next 3 actions (my recommendation)
1. Make the repo private, then decide on the history rewrite.
2. Add unit tests for `canadian-tax.ts` and `compliance-engine.ts`, then update the minimum wages past their review dates and the AB/BC WCB values against official sources.
3. Run the Phase 1 UX scorecard (`UX_EVALUATION_TEMPLATE.md`), fixing the "affiliate" and "2025" copy and adding privacy/terms pages before showing it to any users.
