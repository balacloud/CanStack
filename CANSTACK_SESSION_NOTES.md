# CanStack Session Notes

Last updated: March 16, 2026

## Summary

This workspace now contains a production-style Next.js 14 application for Canadian contractors with two major product areas:

- Start & Plan
- Deadlines & Compliance

The app has been repositioned from a benefits-only dashboard into a broader contractor operations product. The homepage, navigation, and workspace structure were redesigned so the product now reads as one SaaS product serving different operator maturity stages.

## What Was Implemented

### Base Application

- Next.js 14 App Router scaffold
- TypeScript
- Tailwind CSS
- custom lightweight shadcn-style UI primitives
- `next-intl` bilingual routing
- Stripe checkout route
- Supabase client helpers and schema

### Benefits & Planning

- onboarding quiz
- rule-based recommendation engine
- provider resource dashboard
- hardcoded 2025 Canadian tax estimator
- RRSP room calculator
- pricing page and Stripe checkout initiation

### Compliance Hub

- hardcoded compliance rules dataset
- deterministic compliance engine
- 6-step compliance profile wizard
- compliance dashboard
- next-30-days deadline view
- CRA payroll penalty forecaster
- full calendar preview with paywall overlay
- client-side `.ics` generation path
- sessionStorage fallback for unauthenticated users
- Supabase persistence for authenticated users

### UX / UI Redesign

- hero reframed to present CanStack as a combined benefits + compliance product
- explicit workspace switching above the fold
- workspace naming moved to:
  - `Start & Plan`
  - `Deadlines & Compliance`
- stronger mobile-first hierarchy
- cleaner CTA structure
- improved compliance wizard and dashboard presentation
- operator-focused SaaS positioning

### Planning / Decision Documentation

- next 2 weeks execution plan
- production readiness specification
- implementation milestones
- Phase 1 validation checklist

## Current Product Model

### Workspace 1: Start & Plan

Purpose:

- benefits discovery
- contractor planning
- tax visibility
- RRSP planning

Primary code:

- [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)
- [lib/recommendations.ts](/Users/balajik/projects/Canada_Conttractors/lib/recommendations.ts)
- [lib/canadian-tax.ts](/Users/balajik/projects/Canada_Conttractors/lib/canadian-tax.ts)
- [lib/providers.ts](/Users/balajik/projects/Canada_Conttractors/lib/providers.ts)

### Workspace 2: Deadlines & Compliance

Purpose:

- payroll remittance guidance
- sales tax deadline tracking
- provincial compliance reminders
- WCB premium estimation

Primary code:

- [components/compliance-wizard.tsx](/Users/balajik/projects/Canada_Conttractors/components/compliance-wizard.tsx)
- [components/compliance-dashboard.tsx](/Users/balajik/projects/Canada_Conttractors/components/compliance-dashboard.tsx)
- [lib/compliance-rules.ts](/Users/balajik/projects/Canada_Conttractors/lib/compliance-rules.ts)
- [lib/compliance-engine.ts](/Users/balajik/projects/Canada_Conttractors/lib/compliance-engine.ts)

## Important Technical Notes

### No External Runtime Data Dependencies

The compliance module follows the hard constraint that compliance rules must be hardcoded.

There are:

- no `fetch()` calls in the compliance rules or engine
- no CRA API calls
- no Revenu Quebec API calls
- no WCB API calls

### Disclaimers

Compliance penalty and premium outputs are estimates only and must remain framed as:

- estimate only
- not tax advice
- not legal advice where applicable

### Quebec Handling

Quebec sales tax logic explicitly references Revenu Quebec in the compliance engine and dashboard copy path.

### T5018 Handling

T5018 now appears for:

- `industry === construction`

Additional note:

- sole-proprietor construction users now receive an explicit reminder that they may need to file T5018 if they paid subcontractors $500 or more in the year

## Persistence Model

### Unauthenticated

- compliance profile stored in `sessionStorage`
- key: `canstack-profile`
- completion state also stored locally for compliance acknowledgements

### Authenticated

- attempts to persist contractor profile to Supabase
- attempts to persist compliance acknowledgement status to Supabase

Relevant files:

- [lib/supabase/client.ts](/Users/balajik/projects/Canada_Conttractors/lib/supabase/client.ts)
- [supabase/schema.sql](/Users/balajik/projects/Canada_Conttractors/supabase/schema.sql)

## Schema Changes Added

Compliance Hub extended the existing schema with:

- `contractor_profiles`
- `compliance_acknowledgements`

These additions were appended to:

- [supabase/schema.sql](/Users/balajik/projects/Canada_Conttractors/supabase/schema.sql)

## Pricing / Paywall Notes

Pricing config now includes compliance-specific feature flags:

- `complianceCalendarDays`
- `penaltyForecaster`
- `icsExport`
- `t5018Tracker`

Configured in:

- [lib/pricing.ts](/Users/balajik/projects/Canada_Conttractors/lib/pricing.ts)

Current behavior:

- Next 30 days: free
- Penalty forecaster: free
- Full calendar: gated
- `.ics` export: gated

## Compliance Audit Fixes

Recent surgical compliance fixes included:

- corrected CRA payroll penalty brackets to split:
  - `1–3`
  - `4–5`
  - `6–7`
  - `8+`
- corrected payroll penalty forecaster behavior and disclaimer presentation
- updated Ontario WSIB handling so unverified industry rates are not shown as user estimates
- broadened T5018 construction handling beyond incorporated-only logic

## Localization

Current localized content files:

- [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json)
- [messages/fr.json](/Users/balajik/projects/Canada_Conttractors/messages/fr.json)

Recent updates included:

- compliance labels
- redesigned hero framing
- workspace naming updates

## Local Run Notes

The workspace has been run in two ways during the session:

- default Next.js port `3000`
- explicit port `3100`

Current `.env.local` sets:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3100
```

That means:

- `npm run dev` is intended to run on `3100`
- Stripe success/cancel URLs align with `3100` unless `.env.local` is changed

Recommended local run command for consistency:

```bash
cd /Users/balajik/projects/Canada_Conttractors
npm run dev
```

Operational scripts now available:

```bash
npm run dev:start
npm run dev:status
npm run dev:stop
```

Purpose:

- avoid stale `next-server` processes on port `3100`
- avoid stale `.next` runtime artifacts
- provide predictable dev start/stop behavior

## Verification Status

The following completed successfully after the Compliance Hub implementation and redesign work:

```bash
npm run lint
npm run build
```

Both passed.

## Design Documentation

The redesign plan approved and implemented in this session is documented in:

- [UI_REDESIGN_SPEC.md](/Users/balajik/projects/Canada_Conttractors/UI_REDESIGN_SPEC.md)
- [UX_EVALUATION_TEMPLATE.md](/Users/balajik/projects/Canada_Conttractors/UX_EVALUATION_TEMPLATE.md)
- [docs/decisions/NEXT_2_WEEKS_PLAN.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/NEXT_2_WEEKS_PLAN.md)
- [docs/decisions/PRODUCTION_READINESS_SPEC.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PRODUCTION_READINESS_SPEC.md)
- [docs/decisions/IMPLEMENTATION_MILESTONES.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/IMPLEMENTATION_MILESTONES.md)
- [docs/decisions/PHASE_1_VALIDATION_CHECKLIST.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PHASE_1_VALIDATION_CHECKLIST.md)

## Operating Documentation System

The repo now has a lean structured documentation system:

- project context: [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md)
- session protocol: [docs/stable/SESSION_PROTOCOL.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/SESSION_PROTOCOL.md)
- stable rules: [docs/stable/GOLDEN_RULES.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/GOLDEN_RULES.md)
- roadmap: [docs/stable/ROADMAP.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/ROADMAP.md)
- API contracts: [docs/stable/API_CONTRACTS.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/API_CONTRACTS.md)
- current status: [docs/status/CURRENT_STATUS.md](/Users/balajik/projects/Canada_Conttractors/docs/status/CURRENT_STATUS.md)
- known issues: [docs/issues/KNOWN_ISSUES.md](/Users/balajik/projects/Canada_Conttractors/docs/issues/KNOWN_ISSUES.md)
- production planning: [docs/decisions/PRODUCTION_READINESS_SPEC.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PRODUCTION_READINESS_SPEC.md)
- implementation planning: [docs/decisions/IMPLEMENTATION_MILESTONES.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/IMPLEMENTATION_MILESTONES.md)

## Standing Decision Audit Rule

The project should use the following audit standard for future decisions, research interpretation, architecture reasoning, and UX recommendations:

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

This is now documented in:

- [README.md](/Users/balajik/projects/Canada_Conttractors/README.md)
- [CANSTACK_SESSION_NOTES.md](/Users/balajik/projects/Canada_Conttractors/CANSTACK_SESSION_NOTES.md)

## Known Caveats

- Some compliance data includes explicit TODO-style notes where 2026 public confirmation was not established with confidence.
- The app shell is production-style, but real Stripe and Supabase behavior still depends on valid environment values.
- The project does not include a separate backend service; Next.js route handlers serve the local API needs.

## Current High-Value Files

- App shell: [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)
- Compliance wizard: [components/compliance-wizard.tsx](/Users/balajik/projects/Canada_Conttractors/components/compliance-wizard.tsx)
- Compliance dashboard: [components/compliance-dashboard.tsx](/Users/balajik/projects/Canada_Conttractors/components/compliance-dashboard.tsx)
- Compliance rules: [lib/compliance-rules.ts](/Users/balajik/projects/Canada_Conttractors/lib/compliance-rules.ts)
- Compliance engine: [lib/compliance-engine.ts](/Users/balajik/projects/Canada_Conttractors/lib/compliance-engine.ts)
- Tax logic: [lib/canadian-tax.ts](/Users/balajik/projects/Canada_Conttractors/lib/canadian-tax.ts)
- Recommendation logic: [lib/recommendations.ts](/Users/balajik/projects/Canada_Conttractors/lib/recommendations.ts)
- Pricing config: [lib/pricing.ts](/Users/balajik/projects/Canada_Conttractors/lib/pricing.ts)
- Schema: [supabase/schema.sql](/Users/balajik/projects/Canada_Conttractors/supabase/schema.sql)

## Session Close (March 16, 2026)

At this point:

- the product scope is documented
- the latest architecture is documented
- the compliance module is documented
- the redesign work is documented
- the verification status is documented

---

## Session: April 4, 2026 — Data Accuracy Audit

### What Happened

Ran a comprehensive multi-LLM audit (Perplexity, ChatGPT, Gemini) across all 6 research prompts covering:
- CRA tax bracket verification
- RRSP room calculation accuracy
- CRA payroll penalty schedule
- GST/HST/QST/PST rate accuracy
- WCB/WSIB rate verification
- Automated calculation verification architecture

### What Was Found

**P0 Bugs (Critical):**
1. Nova Scotia HST likely wrong — 15% in code, should be 14% (changed April 1, 2025). Needs manual CRA verification.
2. Basic Personal Amount (BPA) not applied — every tax estimate in the app is overstated.

**P1 Bugs:**
3. RRSP room uncapped (no $32,490/$33,810 annual limit)
4. 20% payroll penalty described as automatic (requires gross negligence)
5. WCB shown for exempt sole proprietors
6. 2026 federal brackets published but not in code

**Key Architecture Finding:**
- No open-source Canadian tax library exists (2 of 3 LLMs agree; Gemini named 3 repos that need verification)
- All source data is publicly available at known, stable CRA/provincial URLs
- T4127 CSV files enable automated annual diffing
- CRA PDOC can generate test vectors for cross-validation

### What Was Produced

- `docs/decisions/DATA_SOURCING_AUDIT_SYNTHESIS.md` — full cross-LLM synthesis with priority-ranked bug list, source registry, and architectural recommendation
- `docs/decisions/LLM_Sourcing_right_cra_info_multi_llm_research.md` — raw LLM audit outputs (Perplexity + ChatGPT + Gemini)
- Updated `docs/status/CURRENT_STATUS.md` — reflects data accuracy as top priority
- Updated `docs/issues/KNOWN_ISSUES.md` — P0/P1 issues added with full context

### No Code Changes

This was a research-only session. No source code was modified.

### Next Session Priority

**Design and build a data sourcing system:**
- Source registry (typed, linking every hardcoded value to its official URL)
- Persistence layer (DB-backed, not just files)
- Weekly automated refresh + manual admin refresh via button click
- Full system architecture design before implementation

This is the top priority before any bug fixes — the sourcing system ensures fixes use verified data and stay fresh.

## Session Close (April 4, 2026)

At this point:

- multi-LLM data audit is complete and synthesized
- all P0/P1 bugs are documented with sources and priority
- complete authoritative source registry exists (federal, provincial, WCB)
- architectural direction for sourcing system is drafted
- next session scope is clearly defined

---

## Session: April 9, 2026 — Data Accuracy Bug Fixes

### What Happened

Applied 5 of the 6 P0/P1 data accuracy bugs identified in the April 4 audit. One P0 (NS HST) remains blocked on manual CRA verification. All fixes passed lint + build.

### What Was Fixed

**P0 — BPA not applied (commit 4088e1e)**
- `lib/canadian-tax.ts`: implemented `calculateBpaCredit()` with CRA phaseout logic
- Full BPA $16,129 (2025) / $16,452 (2026) phases out to minimum over income range
- Credit applied at 15% (2025) / 14% (2026) federal rate
- Federal tax estimates were overstated for all income levels before this fix

**P1 — RRSP room uncapped (commit 4088e1e)**
- `lib/canadian-tax.ts`: `calculateRrspRoom` now caps at `$32,490` (2025) / `$33,810` (2026)
- Was overestimating for any income above $180,500

**P1 — 20% payroll penalty wording (commit 5aaaed2)**
- `lib/compliance-rules.ts`: tier-repeat description updated
- Now explicitly states gross negligence requirement per CRA T4001
- Previous wording implied the 20% rate was automatic

**P1 — WCB sole-prop exemptions (commit 89c0f92)**
- `components/compliance-dashboard.tsx`: province-specific disclaimers added
- BC: owner coverage is voluntary — note shown for sole-prop + BC + hasEmployees
- AB: owner coverage is opt-out — note shown for sole-prop + AB + hasEmployees
- Card remains fully hidden when `hasEmployees = false` (existing gate)

**P1 — 2026 federal brackets (commit 4e36a42)**
- `lib/canadian-tax.ts`: `federalBrackets2026` added with 2.0% indexed thresholds
- First bracket rate drops from 14.5% to 14% per CRA 2026 schedule
- `calculateCombinedTaxEstimate` and `calculateRrspRoom` now accept optional `taxYear` param, defaulting to `new Date().getFullYear()`
- BPA constants added for 2026 ($16,452 / $14,829, thresholds $176,669–$258,482)
- RRSP 2026 cap: $33,810

### What Was Not Fixed

**P0 — Nova Scotia HST (still 15% in code, should be 14%)**
- Blocked on manual verification at CRA GST/HST calculator URL
- Do not patch without manual confirmation — only Perplexity caught this; ChatGPT and Gemini did not
- One-line fix in `lib/compliance-rules.ts` NS entry once confirmed

### Supabase Action Items (your manual steps)

Data sourcing Phase 1 is built but not yet activated. To activate:

1. Add to `.env.local`:
   - `SUPABASE_SERVICE_ROLE_KEY` — from Supabase dashboard → Settings → API
   - `CANSTACK_ADMIN_USER_ID` — your Supabase auth user UUID
2. Run `supabase/schema.sql` in Supabase SQL editor (creates `data_sources`, `source_snapshots`, `audit_log`)
3. Run `npx ts-node scripts/seed-sources.ts` to seed 33 source URLs
4. Verify at `http://localhost:3100/en/admin`

### No Contract Changes

No API route signatures, response shapes, or Supabase schema were changed this session.

### Next Session Priority

1. NS HST — you verify at CRA URL, then one-line patch
2. Activate data sourcing Phase 1 (your manual steps above)
3. Phase 2 data sourcing — `compliance_values` propose/approve/publish workflow
4. Production launch hardening

## Session Close (April 9, 2026)

At this point:

- 5 of 6 P0/P1 data accuracy bugs fixed and committed
- tax estimates now include BPA credit, 2026 brackets, and RRSP cap
- compliance copy is accurate (payroll penalty, WCB disclaimers)
- data sourcing Phase 1 built and waiting on activation (env vars + schema + seed)
- only remaining code blocker is NS HST — manual CRA verification needed before patch
- lint and build passing

---

## Session: April 10, 2026 — Supabase Activation + Final P0 Fix

### What Happened

Activated the data sourcing Phase 1 system end-to-end and closed the last remaining P0 bug (NS HST). All P0/P1 data accuracy bugs are now resolved.

### What Was Built / Activated

**Admin login page**
- `app/[locale]/admin/login/page.tsx` — email + password login using Supabase `signInWithPassword`
- `app/[locale]/admin/page.tsx` — unauthorized redirect now goes to `/admin/login` instead of homepage

**Supabase activation (manual steps completed)**
- `dotenv` installed as dev dependency (`package.json`)
- Schema SQL run against Supabase project — all 8 tables confirmed
- 32 sources seeded via `npx tsx scripts/seed-sources.ts`
- `.env.local` updated with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CANSTACK_ADMIN_USER_ID`
- Admin dashboard live and accessible at `http://localhost:3100/en/admin`

**P0 — NS HST patched (commit 498a5d8)**
- `lib/compliance-rules.ts`: NS HST corrected from `0.15` to `0.14`
- Manually verified by user at CRA GST/HST calculator — effective April 1, 2025
- This was the last remaining P0 bug

**Seed URL cleanup (commit 498a5d8)**
- 7 year-specific deep-link URLs replaced with stable parent pages
- Affected: `ab-wcb`, `bc-wcb`, `sk-wcb`, `on-wsib`, `ns-wcb`, `ns-income-tax`, `qc-income-tax`
- Root cause: year-specific WCB pages (e.g. `/2026-rates`) 404 after the year rolls over

### No Contract Changes

No API route signatures or Supabase schema changed this session.

### Next Session Priority

1. Data sourcing Phase 2 — `compliance_values` table + propose/approve/publish workflow
2. Production launch hardening — error boundaries, security headers, Stripe webhook fulfillment
3. Audience validation — run UX evaluation template on live product

## Session Close (April 10, 2026)

At this point:

- **all P0/P1 data accuracy bugs resolved** — product is data-accurate for the first time
- data sourcing Phase 1 fully live — admin dashboard at `/en/admin`, 32 sources monitored
- admin login working end-to-end
- lint and build passing
- next focus is Phase 2 data sourcing and production launch hardening

---

## Session: April 11, 2026 — Skills + Managed Agents Roadmap

### What Happened

Short tooling session. No code or schema changes.

### What Was Built

**Session skills (commit 5486a53)**
- `.claude/skills/canstack-start.md` — invoke with `/canstack-start` to auto-run the full session startup protocol
- `.claude/skills/canstack-close.md` — invoke with `/canstack-close` to auto-run the full session close protocol
- Both replace the need to manually say "start/close the session following the protocol"
- Note: skills activate after Claude Code restart

**Roadmap update (commit c97240a)**
- Phase 3 data sourcing updated: Vercel Cron replaced with Claude Managed Agents API
- Agent will handle weekly URL fetches, SHA-256 hash diffs, and propose compliance value changes for admin approval
- Depends on Phase 2 (`compliance_values` table) being complete first
- Managed Agents API is in beta as of April 2026 (`anthropic-beta: managed-agents-2026-04-01`)

### No Contract or Schema Changes

Nothing changed in routes, API shapes, or Supabase schema.

### Next Session Priority

1. Data sourcing Phase 2 — design and build `compliance_values` table + propose/approve/publish workflow
2. Production launch hardening — error boundaries, security headers, Stripe webhooks
3. Audience validation — run UX evaluation template

## Session Close (April 11, 2026)

At this point:

- session start/close skills created and committed
- Phase 3 roadmap updated to target Claude Managed Agents
- no code changes, build status unchanged from April 10
- working tree clean
