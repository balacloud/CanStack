# Current Status

Last updated: April 9, 2026

## Build Status

- `npm run lint`: passing (as of April 9)
- `npm run build`: passing (as of April 9)

## Runtime Status

- local frontend default port: `3100`
- clean lifecycle scripts available:
  - `npm run dev:start`
  - `npm run dev:status`
  - `npm run dev:stop`

## Product Status

- homepage uses operator-focused positioning
- workspace labels are:
  - `Start & Plan`
  - `Deadlines & Compliance`
- compliance module is implemented and wired into the main shell
- planning and production-readiness decision docs have been added

## Current Focus

- **Activate data sourcing Phase 1** — env vars + schema + seed (manual steps, no code needed)
- **Fix remaining P0** — NS HST (blocked on manual CRA verification)
- **Phase 2 of data sourcing** — `compliance_values` propose/approve/publish workflow
- Production launch hardening after data accuracy is fully resolved

## What Was Built — April 9, 2026

5 data accuracy fixes across `lib/canadian-tax.ts`, `lib/compliance-rules.ts`, `components/compliance-dashboard.tsx`:

- commit `4088e1e` — BPA credit applied to federal tax; RRSP room capped
- commit `5aaaed2` — 20% payroll penalty gross negligence requirement clarified
- commit `89c0f92` — WCB sole-prop owner coverage disclaimers (BC + AB)
- commit `4e36a42` — 2026 federal brackets + year-aware tax/RRSP functions

## What Was Built — April 7, 2026

Phase 1 data sourcing system — commit `7987bac`:
- `supabase/schema.sql` — 3 new tables: `data_sources`, `source_snapshots`, `audit_log`
- `lib/supabase/admin.ts` — service-role client (server-only)
- `lib/admin-auth.ts` — admin auth guard
- `app/api/admin/sources/route.ts` — list + add sources
- `app/api/admin/sources/[id]/check/route.ts` — single source check (SHA-256 hash + audit)
- `app/api/admin/sources/check-all/route.ts` — batch check all active sources
- `app/api/admin/audit-log/route.ts` — paginated audit log
- `app/[locale]/admin/page.tsx` — admin dashboard
- `app/[locale]/admin/audit/page.tsx` — audit log page
- `scripts/seed-sources.ts` — 33 authoritative source URLs

## Current Blockers

- **P0: Nova Scotia HST hardcoded as 15%, correct value is 14% since April 2025** — manually verify at CRA GST/HST calculator URL, then patch `lib/compliance-rules.ts` NS entry (one-line fix once confirmed)
- **Data sourcing Phase 1 not yet activated** — needs `SUPABASE_SERVICE_ROLE_KEY` + `CANSTACK_ADMIN_USER_ID` in `.env.local`, schema SQL run, seed script run
- Some compliance entries still contain TODO-style confidence notes (AB WCB stale, BC WCB unverified)
- Audience validation still qualitative, not instrumented
- Production launch hardening not yet started
