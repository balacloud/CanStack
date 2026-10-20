# Known Issues

## Open — P0 (Critical, Fix Before Launch)

*No open P0 bugs. All resolved.*

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

### 11. Personal data and copyrighted content in public git history (new, October 20, 2026)

Severity: high

Details:

- the GitHub repo `balacloud/CanStack` is public
- three copies of a third party's resume (`docs/Logo/*resume*.docx`, pushed April 5) and third-party YouTube transcripts (`docs/reference/canadianinatshirt-tfsa-transcripts.txt`, pushed September 21) were untracked and gitignored in commit `f59b30a`, but remain readable in git history

Next action:

- make the repo private (user plans October 21)
- decide whether to rewrite history with `git filter-repo` + force-push (needs explicit approval), then ask GitHub Support to purge cached views

### 12. Pricing inconsistency (new, October 20, 2026)

Severity: medium

Details:

- `lib/pricing.ts` charges $49 / $99 / $149 CAD per month (Starter / Growth / Scale)
- the licensing/monetization audit (`docs/decisions/Monitization.md`) assumed $29/mo

Next action:

- pick one price point and update whichever side is wrong

### 13. Recommendation engine links health and disability insurers (new, October 20, 2026)

Severity: medium

Details:

- `lib/recommendations.ts` and `lib/providers.ts` link GreenShield (health/dental) and Edge Benefits (disability), plus Zensurance (commercial P&C)
- all are plain homepage URLs, not affiliate links — but the field is named `affiliateLink`, `messages/en.json` calls them "real affiliate destinations", and the Starter plan lists an "Affiliate provider resource hub"
- referral commissions on health/disability insurance require an LLQP licence (per `docs/decisions/Monitization.md`); none is held

Next action:

- mark these as non-monetized informational links (rename field, fix UI copy), or remove them

### 14. No automated tests on tax or compliance logic (new, October 20, 2026)

Severity: medium

Details:

- no test script in `package.json`, 0 test files
- `lib/canadian-tax.ts`, `lib/compliance-rules.ts`, `lib/compliance-engine.ts` are untested; the BPA threshold bug (issue I) went unnoticed for ~6 months

Next action:

- add unit tests against CRA-published worked examples before any further rule changes

### 15. Provincial minimum wages past their review dates (new, October 20, 2026)

Severity: medium

Details:

- several entries in `PROVINCIAL_MINIMUM_WAGES` have `nextReviewDate` of 2026-04-01 or 2026-10-01, both passed, with values unchanged
- NT, NU, YT are null/TODO; ON and QC carry TODO notes

Next action:

- verify each province against its official 2026 source and update or suppress

### 16. Missing privacy policy and terms (new, October 20, 2026)

Severity: medium

Details:

- no privacy policy page, terms of service, or consent checkbox, while the schema stores quiz responses and contractor profiles

Next action:

- add privacy and terms pages before any real user testing

### 17. Stale "2025" copy in tax explainer (new, October 20, 2026)

Severity: low

Details:

- `messages/en.json` says "2025 federal and provincial bracket logic is hardcoded locally" — the engine is year-aware and also covers 2026

Next action:

- update en/fr copy

### 18. Duplicate monetization doc removed (October 20, 2026)

Severity: resolved housekeeping

Details:

- `docs/decisions/Monitization.md` and `docs/decisions/Audited_NextSteps.md` were byte-identical; `Audited_NextSteps.md` was deleted, `Monitization.md` kept

### 6b. Supabase project appears unreachable (new, October 8, 2026)

Severity: medium (blocks Phase 1/2 data-sourcing work, admin dashboard data layer)

Details:

- `npx tsx scripts/seed-sources.ts` fails with `fetch failed` — the Supabase project hostname is DNS NXDOMAIN, confirmed against the local resolver and 8.8.8.8, while the base `supabase.co` domain resolves fine
- not yet confirmed whether the project was paused, deleted, or the URL/env var is simply stale
- user said they would check the Supabase dashboard directly; outcome not yet reported back

Next action:

- confirm project status in the Supabase dashboard
- update `.env.local` / relevant env vars if the project URL changed, or restore/recreate the project if it was deprovisioned
- re-run `scripts/seed-sources.ts` once resolved — it has 59 rows; the 27 finance-education rows were committed in `b3761b8` (Oct 9) but never seeded (corrected Oct 20; previously described as uncommitted)
- still not resolving in DNS as of October 20, 2026

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

### G. Nova Scotia HST hardcoded at 15% (should be 14%)

Resolved: April 10, 2026 — commit 498a5d8

Manually verified at CRA GST/HST calculator. NS HST reduced from 15% to 14% effective April 1, 2025. Patched `lib/compliance-rules.ts` NS entry.

### H. Data sourcing Phase 1 not activated

Resolved: April 10, 2026

Supabase schema migrated, 32 sources seeded, admin login page built, env vars configured. Admin dashboard live at `/en/admin`.

### I. Federal BPA phase-out thresholds in `lib/canadian-tax.ts` were wrong (refinement of issue B)

Resolved: October 2, 2026

Issue B (April 9, 2026) correctly added the BPA credit but used the wrong phase-out income thresholds — $173,205–$253,414 — which are actually 2024's thresholds, carried forward and mislabeled as 2025, then indexed forward again into a wrong 2026 figure ($176,669). Discovered while cross-auditing a separate finance-education artifact against CRA's official T4127 Payroll Deductions Formulas (122nd edition). Corrected directly against CRA sources: 2025 full-amount threshold is $177,882 (CRA line 30000, confirmed by direct fetch), 2026 is $181,440 (CRA T4127, confirmed by direct fetch). The $253,414 (2025) and $258,482 (2026) minimum-amount thresholds were already correct. `npm run lint` and `npm run build` verified passing.

### A. Stale `.next` runtime causing missing vendor chunk errors

Resolved: March 2026

Fix:

- added clean start/stop/status scripts
- verified fresh dev lifecycle on port `3100`
