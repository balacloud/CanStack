# Current Status

Last updated: October 9, 2026

## Build Status

- `npm run lint`: passing (verified October 9)
- `npm run build`: passing (verified October 9)
- No app code changed this session — finance-education artifact work only (see below). `scripts/seed-sources.ts` has uncommitted finance-education source rows (see Current Blockers).

## Direction Change — October 9, 2026

**User has redirected priority back to this repo's original product: the contractor compliance/tax SaaS.** Four consecutive sessions (Sept 21 → Oct 9) went entirely into the sibling finance-education product instead. Next session's default objective should be Phase 1 validation / compliance product work, not finance-education content, unless the user says otherwise.

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

- **CanStack is now the parent/legal umbrella org** (decided 2026-09-21) — this repo is one of three planned products underneath it, not the whole company
- **All P0/P1 data accuracy bugs resolved** — product is now data-accurate
- **Phase 2 of data sourcing** — `compliance_values` propose/approve/publish workflow
- Production launch hardening (error boundaries, security headers, Stripe webhooks)
- Audience validation and Phase 1 checklist execution
- Sibling finance-education product (separate future repo) is actively producing content — see `docs/content-drafts/` and `.claude/skills/finance-navigator.md`; does not affect this repo's own build or roadmap directly

## What Was Built — October 8-9, 2026

Finance-education content session — no compliance/tax app code changed:

- **finance-navigator skill hardened**: added a "Strict verification mode" section to `.claude/skills/finance-navigator/SKILL.md`, locking in a stricter default audit standard (check boundary conditions not just typical cases, hunt for stale cross-references after any structural edit, distinguish "corroborated" from "directly confirmed" in citations, disclose simplifying assumptions next to the claim) after an on-request "way stricter" pass caught six real errors a normal pass had missed in the RRSP Field Guide artifact.
- **"The RRSP Field Guide" artifact restructured into 3 chapters**: split a new "Employer Match" chapter out of "The Trade," covering the two commonly-conflated employer-match numbers (the salary-% cap vs. the match ratio, 50% vs. 100%). Re-ran the strict audit against the new structure and fixed 4 issues (a self-contradicting definition, a grammar error, a stale forward-reference, and a footer scope error left over from the restructure).
- **Ported a Perplexity-built "TFSA Stocks & ETFs Risk Explorer" into The TFSA Field Guide** as a new "Invest" chapter (9 risk-tiered tabs), restyled to match the existing design system; later stripped all historical-return percentages per user direction (tickers only, no performance framing, to avoid implying advice).
- **Recreated a friend's portfolio dashboard** as a separate one-off artifact ("Portfolio Glide Plan"), verified via automated diff against the source for 100% data fidelity — not part of the finance-navigator content series.
- **Attempted to extend `scripts/seed-sources.ts`** with 27 new finance-education source rows (TFSA/RRSP/CPP/EI/payroll CRA + Quebec sources) to reuse this repo's existing Phase 1 data-sourcing infra for the sibling product rather than building a second system. **Uncommitted** — seeding against the live Supabase table failed with a DNS NXDOMAIN error on the project hostname (confirmed via multiple resolvers, not a sandbox artifact); user is checking the Supabase dashboard. Should be resolved and the seed actually run before this change is committed.
- All three major finance-education artifacts (TFSA Field Guide, Take-Home Ladder, RRSP Field Guide) made responsive to desktop widths (previously phone-width only).
- `npm run lint` and `npm run build` re-verified passing (no app code changed).

## What Was Built — October 2, 2026

Finance-education artifact session that surfaced and fixed a real data-accuracy bug in this repo's own tax engine:

- **Fixed federal Basic Personal Amount (BPA) phase-out thresholds in `lib/canadian-tax.ts`** — while independently auditing a separate finance-education artifact against CRA's official T4127 Payroll Deductions Formulas (122nd edition, eff. Jan 1, 2026), found that this repo's 2026 BPA full-amount threshold was wrong ($176,669, computed by indexing a mislabeled 2024 figure) instead of the CRA-confirmed $181,440. Tracing the same pattern back, the 2025 threshold was also wrong ($173,205, an actual 2024 value) instead of the CRA-confirmed $177,882 (verified directly against CRA's own line 30000 page). Both corrected. This affects federal tax estimates for any user with taxable income in the BPA phase-out band (roughly $177,882–$258,482 depending on year) — the error understated the BPA credit (overstated tax) for incomes just above the old, too-low thresholds. `npm run lint` and `npm run build` verified passing after the fix.
- **TFSA Field Guide artifact updated** (not part of this repo's codebase) — added two clarifications to the withdrawal-mechanics chapter: CRA restores the full withdrawn amount including growth, not just original contributions; and withdrawing Dec 31 vs. Jan 1 changes the room-restoration wait by a full year.
- **New finance-education artifact built**: "The Take-Home Ladder" — a $80K–$190K salary/take-home-pay comparison and live calculator across Alberta, BC, Ontario, Quebec, and Nova Scotia. Extensively audited against official government sources (CRA, gov.bc.ca, alberta.ca, Finances Québec, Revenu Québec, quebec.ca) before being approved for posting to the user's WhatsApp group — this cross-verification process is what surfaced the BPA bug above.

## What Was Built — September 26-29, 2026

Tooling fix + finance-education artifact session — no compliance/tax app code changed:

- **Fixed Claude Code skill discovery** — `.claude/skills/canstack-start.md`, `canstack-close.md`, and `finance-navigator.md` were flat files, which Claude Code's Skill tool never registers (it only discovers `.claude/skills/<name>/SKILL.md`, a directory per skill). Restructured all three into that layout and added proper YAML frontmatter (`name`/`description`) so all three now appear correctly in the available-skills list and can be invoked directly (`/canstack-start`, `/canstack-close`, `/finance-navigator`). Commit `4833a0c`.
- **TFSA WhatsApp series extended into Claude Artifacts**: built "The TFSA Endgame" (what to hold, US withholding tax, death/beneficiary rules — day 4's content as an interactive artifact) and consolidated all three TFSA artifacts built so far (`TFSA Room, Three Ways`, `The TFSA Withdrawal Trap`, `The TFSA Endgame`) into one artifact, "The TFSA Field Guide," with a chapter switcher and one unified light-only design system. Fixed an inconsistency where the Endgame artifact had accidentally added dark-mode support the other two never had.
- Verified two previously-unconfirmed claims (LIRA's US withholding-tax treaty exemption; HXQ's no-distribution ETF structure) against the IRS/Canada-US treaty and Horizons/Global X's own product page before publishing, per the finance-navigator proactive fact-check rule.
- Answered a WhatsApp-group follow-up question (unused TFSA room carrying forward beyond the current year's $7,000 limit) with a direct CRA citation — not yet turned into a formal post.
- `npm run lint` and `npm run build` re-verified passing (no app code changed).

## What Was Built — September 21-22, 2026

Corporate structure and finance-education thread session — no compliance/tax app code changed:

- **CanStack established as parent/legal umbrella org** (Gap Inc model) — this repo's contractor compliance/tax product is one of three planned products underneath it, alongside a personal finance education product and a future insurance aggregator. `PROJECT_CONTEXT.md`, `docs/stable/ROADMAP.md`, and `docs/stable/GOLDEN_RULES.md` all updated to reflect this.
- **New skill `.claude/skills/finance-navigator.md`** built and iterated on — gatekeeps the finance-education product: education-only guardrail (no ticker-specific advice), tier-1 source-of-truth policy (CRA/canada.ca, GetSmarterAboutMoney.ca, etc.), and a proactive fact-checking rule added after a real caught error (an incorrect newcomer-residency claim).
- **TFSA content series completed and posted**: 4 WhatsApp posts covering what a TFSA is, contribution room, the withdrawal trap, and REITs/US withholding tax/successor-beneficiary rules — all in `docs/content-drafts/whatsapp-tfsa/`, all facts verified against CRA before posting.
- **Two interactive artifacts built** illustrating TFSA room by household and the withdrawal trap timeline (private Claude Artifacts, not part of this repo's codebase).
- **Daily cloud routine created** (`RemoteTrigger`) to auto-draft the next WhatsApp post each morning, following the same skill and fact-checking rules.
- `.gitignore` updated to exclude a raw WhatsApp chat export (third-party personal data) that was briefly at risk of being committed.
- `npm run lint` and `npm run build` re-verified passing (no code changed, verification only).

## What Was Built — September 3, 2026

Verification-only session — no product code changes:

- session startup protocol run, current status reviewed with the user
- discussed available Claude tooling relevant to CanStack (DesignSync/design-system sync, Artifacts for UI mockups, dataviz skill, Claude in Chrome, code-review/security-review skills) — no tooling adopted yet
- `npm run lint` verified passing
- `npm run build` verified passing
- repository was clean at session close before documentation updates

## What Was Built — August 3, 2026

Verification-only session — no product code changes:

- `npm run lint` verified passing
- `npm run build` verified passing
- repository was clean at session close before documentation updates

## What Was Built — July 30, 2026

Tooling and session workflow session — no product code changes:

- `.claude/skills/canstack-start.md` — gamified Claude startup skill into a mission briefing with readiness score, quests, hazards, power-ups, audit gate, and start line
- `/Users/balajik/.codex/skills/canstack-start/SKILL.md` — global Codex startup skill installed and validated
- `/Users/balajik/.codex/skills/canstack-close/SKILL.md` — global Codex close skill installed and validated
- `npm run lint` and `npm run build` verified passing

## What Was Built — April 11, 2026

Tooling and roadmap session — no code changes:

- `.claude/skills/canstack-start.md` — `/canstack-start` session startup skill (commit 5486a53)
- `.claude/skills/canstack-close.md` — `/canstack-close` session close skill (commit 5486a53)
- `docs/stable/ROADMAP.md` — Phase 3 updated to use Claude Managed Agents instead of plain Vercel Cron (commit c97240a)

## What Was Built — April 10, 2026

Supabase activation + final P0 fix:

- `app/[locale]/admin/login/page.tsx` — admin login page (email + password)
- `app/[locale]/admin/page.tsx` — redirect changed from homepage to `/admin/login` on unauth
- `lib/compliance-rules.ts` — NS HST patched 0.15 → 0.14 (commit 498a5d8)
- `scripts/seed-sources.ts` — 7 year-specific WCB/provincial URLs updated to stable parent pages
- `package.json` — `dotenv` added as dev dependency
- Supabase: schema migrated, 32 sources seeded, admin dashboard live at `/en/admin`

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

- **Supabase project appears unreachable** — the project hostname used by `scripts/seed-sources.ts` and the admin dashboard's data layer fails DNS resolution entirely (confirmed via multiple resolvers, Oct 8 2026). Not yet confirmed whether the project was paused/deleted or the URL changed. Needs checking before any further Phase 1/2 data-sourcing work, and before the admin dashboard at `/en/admin` can be assumed functional.
- Some WCB source URLs still returning errors in admin dashboard — stable parent URLs now seeded, re-check needed
- Some compliance entries still contain TODO-style confidence notes (AB WCB stale, BC WCB unverified)
- Audience validation still qualitative, not instrumented
- Production launch hardening not yet started (error boundaries, security headers, Stripe webhooks)
- **Phase 1 validation on the actual compliance/tax product has now gone untouched for 4+ consecutive sessions** (Sept 21 → Oct 9) while sibling finance-education work took priority — user has now redirected back to this product as of Oct 9, see "Direction Change" above
