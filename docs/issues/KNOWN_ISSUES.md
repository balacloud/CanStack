# Known Issues

## Open — P0 (Critical, Fix Before Launch)

### 1. Nova Scotia HST likely wrong (15% → 14%)

Severity: P0

Details:

- our code has NS HST at 0.15 (15%) in `lib/compliance-rules.ts`
- Perplexity audit (April 4, 2026) found NS HST dropped to 14% effective April 1, 2025
- CRA GST/HST calculator page cited as source with direct quote
- ChatGPT and Gemini did NOT catch this change (listed 15%)
- **requires manual verification at CRA calculator URL before patching**

Next action:

- manually verify at `canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html`
- if confirmed, patch `lib/compliance-rules.ts` NS entry

## Open — P1 (Fix Before Launch)

### 4. ~~20% payroll penalty description is misleading~~ — RESOLVED April 9, 2026

Severity: P1 → resolved

Fix: commit 5aaaed2 — description in `CRA_PAYROLL_PENALTY_SCHEDULE` tier-repeat now explicitly states gross negligence requirement per CRA T4001.

### 5. ~~WCB premiums shown for exempt sole proprietors~~ — RESOLVED April 9, 2026

Severity: P1 → resolved

Fix: commit 89c0f92 — WCB card already gated on `hasEmployees`. Added province-specific disclaimers in `compliance-dashboard.tsx` for BC (owner coverage voluntary) and AB (owner coverage opt-out) sole proprietors.

### 6. ~~2026 federal brackets not in code~~ — RESOLVED April 9, 2026

Severity: P1 → resolved

Fix: commit 4e36a42 — `federalBrackets2026` added with 2.0% indexed thresholds and 14% first bracket rate. BPA and RRSP caps also updated for 2026. `calculateCombinedTaxEstimate` and `calculateRrspRoom` are now year-aware (auto-detect current year, or accept explicit `taxYear` param).

## Open — Medium (Existing)

### 7. Some compliance entries are intentionally conservative

Severity: medium

Details:

- certain WCB/minimum wage entries include TODO-style notes rather than invented values
- Alberta WCB rates confirmed stale (still 2025 data, 2026 rates available)
- BC WCB rates (4.11% construction, 0.17% IT) could not be verified by any LLM

Next action:

- validate all TODO-marked items against official 2026 sources
- verify BC WCB rates directly at WorkSafeBC 2026 rate table

### 8. UX positioning is improved but not fully user-validated

Severity: medium

Details:

- the product now has clearer SaaS positioning
- however, audience understanding and first-click behavior have not yet been validated

Next action:

- run [UX_EVALUATION_TEMPLATE.md](/Users/balajik/projects/Canada_Conttractors/UX_EVALUATION_TEMPLATE.md)

### 9. Production launch infrastructure is not yet hardened

Severity: medium

Details:

- checkout exists, but webhook-driven subscription synchronization is not documented as implemented
- route/global error boundaries and instrumentation are not yet in the repo
- security headers and CSP are not yet configured in app code

Next action:

- use [docs/decisions/PRODUCTION_READINESS_SPEC.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PRODUCTION_READINESS_SPEC.md) and [docs/decisions/IMPLEMENTATION_MILESTONES.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/IMPLEMENTATION_MILESTONES.md) after data accuracy issues are resolved

### 10. Data sourcing system Phase 1 built, not yet activated

Severity: medium

Details:

- Phase 1 shipped April 7, 2026 (commit 7987bac)
- DB tables, API routes, admin UI, and seed script all built and passing lint + build
- requires `SUPABASE_SERVICE_ROLE_KEY` + `CANSTACK_ADMIN_USER_ID` env vars, schema migration, and seed run to go live

Next action:

- activate Phase 1 (env vars → schema → seed → verify `/en/admin`)
- Phase 2: `compliance_values` table + propose/approve/publish workflow
- Phase 3: Vercel Cron for weekly automated checks

## Resolved

### B. Basic Personal Amount (BPA) not applied to tax estimates

Resolved: April 9, 2026 — commit 4088e1e

BPA credit now applied in `calculateCombinedTaxEstimate`. Full $16,129 phases out to $14,538 between $173,205–$253,414 income; credit applied at 15% CRA rate (2025) / 14% (2026).

### C. RRSP room had no annual dollar cap

Resolved: April 9, 2026 — commit 4088e1e

`calculateRrspRoom` now caps at `$32,490` (2025) / `$33,810` (2026) via `Math.min()`.

### D. 20% payroll penalty described as automatic

Resolved: April 9, 2026 — commit 5aaaed2

Description in `CRA_PAYROLL_PENALTY_SCHEDULE` tier-repeat updated to require gross negligence finding per CRA T4001.

### E. WCB premiums shown for exempt sole proprietors

Resolved: April 9, 2026 — commit 89c0f92

WCB card gated on `hasEmployees`. Province-specific disclaimers added for BC (voluntary) and AB (opt-out) sole proprietors.

### F. 2026 federal brackets not in code

Resolved: April 9, 2026 — commit 4e36a42

`federalBrackets2026` added. Tax functions now year-aware, defaulting to current year.

### A. Stale `.next` runtime causing missing vendor chunk errors

Resolved: March 2026

Fix:

- added clean start/stop/status scripts
- verified fresh dev lifecycle on port `3100`
