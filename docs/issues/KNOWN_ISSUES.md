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

### 2. ~~Basic Personal Amount (BPA) not applied to tax estimates~~ — RESOLVED April 9, 2026

Severity: P0 → resolved

Fix: commit 4088e1e — BPA credit applied in `calculateCombinedTaxEstimate`. Full $16,129 phases out to $14,538 between $173,205–$253,414 income; credit at 15% CRA rate.

## Open — P1 (Fix Before Launch)

### 3. ~~RRSP room has no annual dollar cap~~ — RESOLVED April 9, 2026

Severity: P1 → resolved

Fix: commit 4088e1e — `calculateRrspRoom` now caps at `RRSP_2025_CAP = $32,490` via `Math.min()`.

### 4. 20% payroll penalty description is misleading

Severity: P1

Details:

- `lib/compliance-rules.ts` tier-repeat entry implies 20% is automatic for second offence
- CRA T4001 says 20% only applies if failure was "knowingly or under circumstances of gross negligence"
- all 3 LLMs confirmed unanimously

Next action:

- update description text in `CRA_PAYROLL_PENALTY_SCHEDULE`

### 5. WCB premiums shown for exempt sole proprietors

Severity: P1

Details:

- compliance dashboard may show WCB obligations to users who are exempt
- BC: owner coverage voluntary; AB: owner coverage opt-out; ON IT: generally not required without employees
- all 3 LLMs confirmed ON WSIB IT exemption unanimously

Next action:

- add business structure + employee count to display logic before showing WCB premiums

### 6. 2026 federal brackets not in code

Severity: P1

Details:

- app uses 2025 brackets only
- 2026 brackets published by CRA (confirmed by all 3 LLMs)
- first bracket rate changes from 14.5% (blended) to 14% (flat)
- thresholds shift due to 2.0% indexation

Next action:

- add 2026 bracket table and make tax year selectable or auto-detect

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

### A. Stale `.next` runtime causing missing vendor chunk errors

Status: resolved

Fix:

- added clean start/stop/status scripts
- verified fresh dev lifecycle on port `3100`
