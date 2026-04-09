# Current Status

Last updated: April 7, 2026

## Build Status

- `npm run lint`: passing (as of April 7)
- `npm run build`: passing (as of April 7)

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

- **Fix P0/P1 data accuracy bugs** — data sourcing system is now built; next step is applying verified fixes
- Phase 2 of data sourcing system (compliance_values propose/approve/publish workflow)
- Production launch hardening after data accuracy is resolved

## What Was Built This Session (April 7, 2026)

Phase 1 data sourcing system — commit 7987bac on main:
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

**Still needs activation:** set `SUPABASE_SERVICE_ROLE_KEY` + `CANSTACK_ADMIN_USER_ID` in `.env.local`, run schema SQL, run seed script.

## Current Blockers

- **P0: Nova Scotia HST hardcoded as 15%, correct value is 14% since April 2025** — verify at CRA calculator URL then patch `lib/compliance-rules.ts`
- **P0: Basic Personal Amount (BPA) not applied** — all tax estimates are overstated, fix in `lib/canadian-tax.ts`
- **P1: RRSP room has no annual dollar cap** — overestimates for income >$180K
- **P1: 20% payroll penalty described as automatic** — actually requires gross negligence finding
- **P1: WCB shown for sole proprietors who may be exempt** — display logic gap
- **P1: 2026 federal brackets published but not in code** — app shows 2025 data
- some compliance rule entries still contain TODO-style confidence notes
- audience validation is still qualitative, not instrumented
- production launch hardening not yet implemented
