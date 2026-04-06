# CanStack Data Sourcing System — Architecture Plan (Audited)

## Context

CanStack has ~457 hardcoded tax and compliance data items across `lib/compliance-rules.ts` and `lib/canadian-tax.ts`. A 3-LLM audit (April 4, 2026) found P0 bugs (wrong NS HST, missing BPA) and confirmed zero infrastructure for tracking data freshness, detecting source changes, or auditing who verified what.

All source data is publicly available at known government URLs (CRA, provincial ministries, WCB boards). These are HTML/PDF pages, not APIs. They update on predictable annual cycles.

**Goal:** Build a data confidence system that monitors official sources, detects changes, stages value updates for admin review, and maintains an audit trail.

**On implementation start:** Copy this plan to `docs/decisions/DATA_SOURCING_SYSTEM_ARCHITECTURE.md`.

---

## Audit Framework Applied to Every Architectural Decision

### Decision 1: Runtime data stays in TypeScript, not served from DB

> **Claim:** "DB as runtime source adds a SPOF. TypeScript constants are safer for compliance-critical calculations."
> **Reasoning:** Golden Rule #3 mandates hardcoded typed constants. If Supabase has an outage, DB-served calculations break. TypeScript is version-controlled, deterministic, and tested at build time. The data changes a few times per year — not often enough to justify dynamic serving.
> **Verdict:** [VERIFIED — SOURCE: `docs/stable/GOLDEN_RULES.md` Rule #2: "Compliance data must be hardcoded typed constants in dedicated lib/ files." Also Rule #3: "Prefer deterministic business logic for compliance-sensitive flows."]

**Self-question: But the user said "persist in DB and retrieve" — are we ignoring their intent?**
No. The DB persists the source registry, snapshots, staging values, and audit trail. The user's intent is a system to manage and refresh data. The DB serves that management layer. The runtime consumption stays in TypeScript. The user's admin workflow is DB-backed. The user-facing calculations are not.

**Self-question: What if we need to change a value urgently and can't wait for a deploy?**
A Vercel deploy takes ~60 seconds from git push. For an urgent correction, the admin updates the TS file, pushes, and it's live in a minute. This is faster than building a dynamic runtime system with cache invalidation, error fallbacks, and health checks. The "fast path" is already fast enough.

---

### Decision 2: Change detection via content hash, not DOM parsing

> **Claim:** "Government HTML pages don't have stable DOM structures. Content hashing detects changes reliably; DOM parsing will break silently."
> **Reasoning:** CRA and provincial sites redesign periodically. CSS changes, banner additions, cookie consent overlays, and navigation restructuring all change the DOM without changing the data. A DOM parser targeting specific selectors will break on redesign with no warning — it will either throw errors or worse, return empty/wrong data silently.
> **Verdict:** [PLAUSIBLE — REASON: No formal study of CRA page stability exists, but this is consistent with well-established web scraping engineering principles. Government sites are NOT designed for machine consumption. What would confirm: testing a DOM parser against CRA pages over 6 months. Not worth the investment given the low update frequency.]

**Self-question: Won't hashing produce false positives from footer changes, cookie banners, timestamps?**
Yes. Some hash changes will be noise (page layout changed, not data). But the cost of a false positive is 30 seconds of admin review. The cost of a false negative (missing a real rate change) is wrong tax calculations for users. We accept false positives. We cannot accept false negatives.

**Self-question: Could we hash only a specific section of the page to reduce noise?**
Possible but fragile — we'd need to identify the right section per URL, and that selection breaks when the page restructures. A simpler noise reduction: strip common volatile elements (script tags, style tags, HTML comments) before hashing. This can be added in Phase 2 if noise is too high.

**Refinement added:** Phase 1 hashes the full response body. If false positive rate is too high, Phase 2 adds a pre-hash sanitizer that strips `<script>`, `<style>`, `<nav>`, and HTML comments before hashing.

---

### Decision 3: No HuggingFace, no LLM for data extraction

> **Claim:** "This is a data engineering problem, not an ML problem. LLMs hallucinate, which is the exact problem we're solving."
> **Reasoning:** HuggingFace hosts ML models, embeddings, and datasets. None of these apply to fetching structured data from known URLs. Using an LLM to extract tax rates from HTML introduces a non-deterministic step in a compliance-critical pipeline. If the LLM says "NS HST is 14%" but it's actually 15%, we've automated the creation of wrong data.
> **Verdict:** [VERIFIED — SOURCE: The entire 3-LLM audit (April 4) demonstrated that LLMs disagree on basic facts. 2 of 3 LLMs got NS HST wrong. Using LLMs for extraction would reproduce exactly this failure mode. `docs/decisions/DATA_SOURCING_AUDIT_SYNTHESIS.md`, NS HST disagreement section.]

**Self-question: What about using LLMs as a SECOND opinion, not the primary extractor?**
Interesting but premature. For Phase 1, the admin reads the source page (30 seconds) and enters the value. If we later want LLM-assisted extraction, it could propose values that the admin verifies — never auto-applied. This is a Phase 4+ enhancement, not a foundation concern.

---

### Decision 4: Service-role key for admin DB access

> **Claim:** "Admin tables should bypass RLS using the service-role key, accessed only from server-side Route Handlers."
> **Reasoning:** The existing app uses anon-key with RLS for user isolation. Admin tables (data_sources, audit_log) are not user-scoped — they're system-level. RLS policies for admin tables would require a roles system that doesn't exist. The service-role key is the standard Supabase pattern for server-side admin operations.
> **Verdict:** [VERIFIED — SOURCE: Supabase official documentation recommends service-role key for server-side operations that bypass RLS. `lib/supabase/server.ts` already shows the pattern we'd follow. The `PRODUCTION_READINESS_SPEC.md` line 169 already notes "Supabase service-role keys if introduced later."]

**Self-question: Is the service-role key safe in Next.js Route Handlers?**
Yes — Route Handlers execute server-side only. The key goes in `SUPABASE_SERVICE_ROLE_KEY` (NOT `NEXT_PUBLIC_*`), so it's never sent to the browser. The existing `app/api/checkout/route.ts` shows the same pattern with `STRIPE_SECRET_KEY`.

**Self-question: What if someone discovers the admin API endpoints?**
The admin routes check two things: (1) valid Supabase auth session (cookie), (2) user ID matches `CANSTACK_ADMIN_USER_ID` env var. Without both, the route returns 401. An unauthenticated caller can't even reach the admin logic.

---

### Decision 5: Single admin user via env var, not a roles system

> **Claim:** "Since this is a single-founder app, checking user ID against an env var is sufficient. No need for a roles table."
> **Reasoning:** Building RBAC (roles, permissions, role assignments) for a single admin user is over-engineering. The env var approach is: one comparison, one env var, zero additional tables. If the team grows, we add RBAC then.
> **Verdict:** [PLAUSIBLE — REASON: Correct for current team size (1). The risk is that if a second admin is needed, the env var approach requires a code change (comma-separated IDs) rather than a DB change. Acceptable trade-off for Phase 1.]

**Self-question: What if we need to revoke admin access quickly?**
Change the env var in Vercel dashboard → instant effect on next request (no deploy needed for env var changes on Vercel). This is actually faster than a DB-based roles system.

---

### Decision 6: Manual TS editing after approval (no code generator in Phase 1)

> **Claim:** "Manual editing with lint+build verification is sufficient for the update frequency."
> **Reasoning:** The TypeScript constants have varying structures — flat records, nested objects, arrays of objects with different shapes. A code generator that handles all these shapes correctly is a significant engineering effort. The data changes a few times per year. Manual editing of a known file takes 5 minutes. lint + build catches errors.
> **Verdict:** [PLAUSIBLE — REASON: Correct for current update frequency. Risk: human error during manual editing. Mitigation: the admin UI shows the exact value to enter, the lint/build step catches type errors, and the audit log records what was changed.]

**Self-question: Is there a cheaper middle ground before a full code generator?**
Yes. A "copy-paste snippet" generator — the admin UI could display a ready-to-paste TypeScript snippet for each approved value change. Not auto-applied, but reduces manual transcription errors. **Added to Phase 2.**

---

### Decision 7: Vercel Cron for weekly automated checks

> **Claim:** "Vercel Cron is the right choice for weekly source monitoring."
> **Reasoning:** We're already on Vercel. Vercel Cron is configured in `vercel.json`, runs serverless, and calls a Route Handler. Alternatives: Supabase pg_cron (requires Edge Functions, different deployment), GitHub Actions (requires repo access setup, separate auth), or a third-party cron service (unnecessary dependency).
> **Verdict:** [PLAUSIBLE — REASON: Vercel Cron is the simplest option within our existing stack. Caveat: Vercel Cron is available on Pro plan ($20/mo). If CanStack is on Hobby plan, this won't work. Fallback: GitHub Actions scheduled workflow (free for public repos). NEEDS VERIFICATION: which Vercel plan is CanStack on.]

**Self-question: What if the weekly check takes too long for a serverless function?**
50+ URLs × ~2 seconds each = ~100 seconds worst case. Vercel serverless functions have a 60-second timeout on Hobby, 300 seconds on Pro. If on Hobby, we'd need to batch (check 25 sources per invocation, run twice). **Refinement: add batching logic to check-all endpoint.**

**Refinement added:** The check-all endpoint processes sources in batches of 20 with a configurable batch size. Each batch runs sequentially within the function. If the function times out, incomplete sources are flagged for the next run.

---

### Decision 8: Four Supabase tables

> **Claim:** "data_sources, source_snapshots, compliance_values, and audit_log are the right schema."
> **Reasoning:** Each table has a single responsibility. data_sources = what to monitor. source_snapshots = when we checked and what we found. compliance_values = what the data is and its lifecycle. audit_log = immutable history.

**Self-question: Do we really need compliance_values, or is it over-engineering for Phase 1?**
Good question. The minimum viable system is: data_sources + source_snapshots + audit_log. That gives us monitoring and change detection. compliance_values adds the staging/approval workflow. Could we defer it?

**Answer:** Yes. **Phase 1 can ship with 3 tables.** compliance_values is Phase 2. In Phase 1, the admin sees which sources changed, reads the page, updates the TS file directly, and logs the action in audit_log. Phase 2 adds the formal propose/approve/publish workflow.

**Refinement:** Reduced Phase 1 to 3 tables. compliance_values moves to Phase 2.

---

## Refined Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    ADMIN (You)                          │
│                                                         │
│  /admin dashboard → see freshness → click refresh       │
│       Phase 1: detect changes → update TS directly      │
│       Phase 2: propose → approve → publish workflow     │
│  /admin/audit    → full audit trail                     │
└───────────┬─────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│              API Routes (service-role key)               │
│                                                         │
│  POST /api/admin/sources/check-all  → fetch & hash      │
│  POST /api/admin/sources/[id]/check → single check      │
│  GET  /api/admin/sources            → list + status      │
│  POST /api/admin/sources            → add source         │
│  GET  /api/admin/audit-log          → history            │
│                                                         │
│  Phase 2 adds:                                          │
│  POST /api/admin/values/[id]/propose                    │
│  POST /api/admin/values/[id]/approve                    │
│  POST /api/admin/values/[id]/publish                    │
└───────────┬─────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────┐
│              SUPABASE (service-role, no RLS)             │
│                                                         │
│  Phase 1: data_sources + source_snapshots + audit_log   │
│  Phase 2: + compliance_values                           │
└─────────────────────────────────────────────────────────┘
            │
            │ (admin updates TS after reviewing changes)
            ▼
┌─────────────────────────────────────────────────────────┐
│            TypeScript Constants (RUNTIME)                │
│                                                         │
│  lib/compliance-rules.ts  ← app reads THESE at runtime  │
│  lib/canadian-tax.ts      ← not the DB                  │
│                                                         │
│  git commit → Vercel deploy → live (~60 seconds)        │
└─────────────────────────────────────────────────────────┘
```

---

## DB Schema

### Phase 1 Tables (3 tables)

```sql
-- Source Registry: what URLs we monitor
create table data_sources (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,        -- "federal-brackets-2026", "ns-hst"
  jurisdiction    text not null,               -- "federal" | province code
  category        text not null,               -- "income-tax-brackets" | "sales-tax" | "wcb" | "payroll-penalties" | "rrsp" | "minimum-wage"
  source_url      text not null,               -- official URL to monitor
  document_ref    text,                        -- "CRA T4001", "WSIB 2026 Premium Rates"
  effective_date  date,                        -- when this data takes effect
  update_cycle    text not null,               -- "annual-january" | "annual-october" | "rare" | "varies"
  next_expected   date,                        -- when we expect the next update
  ts_file         text not null,               -- "lib/compliance-rules.ts" or "lib/canadian-tax.ts"
  ts_constant     text not null,               -- "PROVINCIAL_SALES_TAX_RATES" | "federalBrackets2025"
  notes           text,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Snapshots: content hashes per fetch
create table source_snapshots (
  id              uuid primary key default gen_random_uuid(),
  source_id       uuid not null references data_sources(id) on delete cascade,
  fetched_at      timestamptz default now(),
  http_status     integer,                     -- 200, 404, 500
  content_hash    text,                        -- SHA-256 of response body
  content_length  integer,
  hash_changed    boolean not null default false,
  error_message   text,
  created_at      timestamptz default now()
);

create index idx_snapshots_source_time on source_snapshots(source_id, fetched_at desc);

-- Audit Log: immutable action history (INSERT-ONLY)
create table audit_log (
  id              uuid primary key default gen_random_uuid(),
  action          text not null,               -- "source_checked" | "hash_changed" | "source_error" | "value_updated" | "source_added"
  source_id       uuid references data_sources(id),
  details         jsonb,                       -- { old_value, new_value, http_status, error, ... }
  actor           text not null default 'system',  -- "admin" | "system" | "cron"
  created_at      timestamptz default now()
);

create index idx_audit_created on audit_log(created_at desc);
```

### Phase 2 Table (added later)

```sql
-- Value Staging: propose → approve → publish lifecycle
create table compliance_values (
  id              uuid primary key default gen_random_uuid(),
  source_id       uuid not null references data_sources(id) on delete cascade,
  data_key        text not null,               -- "NS.hst", "federal.bracket.1.rate"
  current_value   text not null,               -- what's in the TS file now
  proposed_value  text,                        -- what admin wants to change to
  value_type      text not null default 'number',
  status          text not null default 'current'
                  check (status in ('current','proposed','approved','published','rejected')),
  proposed_at     timestamptz,
  approved_at     timestamptz,
  published_at    timestamptz,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique(source_id, data_key)
);
```

**No RLS on any admin table.** Accessed exclusively via service-role key in server-side Route Handlers.

---

## Admin Auth

```
lib/admin-auth.ts
```

```typescript
// Pattern: check Supabase session + admin user ID
// Uses cookie-based server client for session check
// Then verifies user.id === process.env.CANSTACK_ADMIN_USER_ID
// Returns { authorized: boolean, userId: string | null }
```

New env vars needed:
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase project service-role key (server-only, NOT `NEXT_PUBLIC_`)
- `CANSTACK_ADMIN_USER_ID` — Supabase auth user ID for the admin

```
lib/supabase/admin.ts
```

Follows the pattern in `lib/supabase/server.ts` but uses `SUPABASE_SERVICE_ROLE_KEY` instead of `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Does NOT use cookies (not user-session-aware). Server-only — never imported by client components.

---

## Admin API Routes (Phase 1)

All under `app/api/admin/`. Every route: checks admin auth first, uses service-role client.

### `GET /api/admin/sources`
Returns all `data_sources` rows with latest snapshot joined:
- last_checked_at, last_http_status, last_hash_changed, days_since_check
- Color logic: green (checked recently, no change), yellow (hash changed), red (error or overdue)

### `POST /api/admin/sources`
Adds a new source. Body: `{ slug, jurisdiction, category, source_url, ... }`. Writes audit_log `source_added`.

### `POST /api/admin/sources/[id]/check`
Core logic:
1. Fetch `source_url` with 10-second timeout, User-Agent header
2. SHA-256 hash of response body
3. Get latest snapshot for this source
4. Compare hashes → set `hash_changed`
5. Insert `source_snapshots` row
6. Insert `audit_log` entry (`source_checked` | `hash_changed` | `source_error`)
7. Return snapshot result

### `POST /api/admin/sources/check-all`
Iterates all active sources in batches of 20. For each batch:
1. Process sources sequentially (avoid hammering government servers)
2. Insert snapshots and audit entries
3. Return summary: `{ checked, changed, errored, skipped }`

### `GET /api/admin/audit-log`
Paginated (last 100), filterable by `source_id` and `action` query params.

---

## Admin UI (Phase 1)

### `/admin` — Dashboard

**Layout:** Full-width page, no locale routing needed (admin-only). Protected by auth check in page component.

**Top row — status cards:**
- Total sources monitored
- Sources with hash changes (yellow badge if > 0)
- Sources with errors (red badge if > 0)
- Last full check timestamp

**Main area — source table:**

| Slug | Jurisdiction | Category | Source URL | Last Checked | Status | TS File | Action |
|---|---|---|---|---|---|---|---|
| federal-brackets-2026 | federal | income-tax | [link] | 2 days ago | green | canadian-tax.ts | [Check Now] |
| ns-hst | NS | sales-tax | [link] | 2 days ago | yellow | compliance-rules.ts | [Check Now] |

Color logic:
- **Green:** checked within update cycle, no hash change, HTTP 200
- **Yellow:** hash_changed = true on latest snapshot (page content differs)
- **Red:** HTTP error (404/500/timeout) OR overdue (past `next_expected` with no recent check)

**Buttons:**
- "Refresh All Sources" → calls check-all, shows progress
- Per-row "Check Now" → calls single check

### `/admin/audit` — Audit Log

Reverse-chronological table. Columns: Timestamp, Action, Source, Actor, Details.
Expandable details row for the JSONB `details` field.

---

## Seeding Strategy

The complete source registry exists in `docs/decisions/DATA_SOURCING_AUDIT_SYNTHESIS.md`. Seeding script:

1. Parse the source registry tables from the synthesis doc
2. Generate INSERT statements for `data_sources`
3. Run against Supabase

**Approximate seed data:** ~35-40 source URLs covering:
- Federal tax rates page (1)
- Provincial tax pages (13)
- CRA T4001 (1)
- CRA RC4022 (1)
- CRA PDOC (1)
- RRSP limits page (1)
- GST/HST calculator (1)
- Provincial WCB boards (~10)
- Cross-reference sources — KPMG, TaxTips.ca (2)

---

## Edge Cases

### Source URL returns 404
- `source_snapshots.http_status = 404`, `error_message` captured
- Dashboard shows red indicator
- Admin investigates, updates `data_sources.source_url` if URL moved
- Audit log captures the error

### Mid-year unexpected rate change
- Weekly hash check catches it (if source page updated)
- Dashboard turns yellow for that source
- Admin reads page, identifies change, updates TS

### Admin enters wrong value
- Phase 1: lint + build catches type errors. Git history provides rollback.
- Phase 2: approval workflow adds a review step. `compliance_values` tracks old and proposed values.

### Vercel function timeout on check-all
- Batch processing (20 sources per batch)
- If timeout occurs mid-batch, completed snapshots are already persisted
- Next check-all run picks up where it left off (checks sources without recent snapshots first)

### Government page has dynamic content (JS-rendered)
- Most CRA/provincial pages are server-rendered HTML. Fetch gets the full content.
- If a page is SPA-only (unlikely for government), the fetch will get an empty shell and the hash will be the shell hash. It won't detect data changes. This is a known limitation — flag such sources in `data_sources.notes` and check them manually.

---

## Implementation Phases (Refined)

### Phase 1: Source Monitoring (Build First)

**New files:**
- `lib/supabase/admin.ts` — service-role client
- `lib/admin-auth.ts` — auth guard helper
- `app/api/admin/sources/route.ts` — GET (list) + POST (add)
- `app/api/admin/sources/[id]/check/route.ts` — single source check
- `app/api/admin/sources/check-all/route.ts` — batch check
- `app/api/admin/audit-log/route.ts` — paginated log
- `app/[locale]/admin/page.tsx` — dashboard
- `app/[locale]/admin/audit/page.tsx` — audit log
- `scripts/seed-sources.ts` — seed data_sources from synthesis doc

**Modified files:**
- `supabase/schema.sql` — add 3 tables
- `.env.example` — add `SUPABASE_SERVICE_ROLE_KEY`, `CANSTACK_ADMIN_USER_ID`

**Deliverable:** Admin can see all 35+ sources, click refresh, see which pages changed, review audit trail.

### Phase 2: Value Management + Approval Workflow

**New files:**
- `app/api/admin/values/route.ts` — list values
- `app/api/admin/values/[id]/propose/route.ts`
- `app/api/admin/values/[id]/approve/route.ts`
- `app/api/admin/values/[id]/reject/route.ts`
- `app/api/admin/values/[id]/publish/route.ts`
- `app/[locale]/admin/values/page.tsx` — value management page
- `scripts/seed-values.ts` — seed compliance_values from TS files

**Modified files:**
- `supabase/schema.sql` — add compliance_values table

**Enhancements:**
- Copy-paste TS snippet generator (shows ready-to-paste code for approved changes)
- Hash sanitizer (strips `<script>`, `<style>`, `<nav>`, comments before hashing) if false positive rate is too high

**Deliverable:** Full propose → approve → publish workflow with audit trail.

### Phase 3: Automation

**New files:**
- `app/api/admin/cron/check-sources/route.ts` — cron endpoint
- `vercel.json` — cron configuration

**Enhancements:**
- Staleness detection (sources past `next_expected` without recent check)
- TS-vs-DB drift detection (compare `compliance_values.current_value` against actual TS file)

**Deliverable:** Weekly automated monitoring. Admin checks dashboard for yellow/red flags.

### Phase 4: Future Enhancements
- Email/Slack notifications on hash changes
- Code generator (approved values → TypeScript constant definitions)
- CRA T4127 CSV auto-differ
- LLM-assisted value extraction (proposes values, admin verifies — never auto-applied)
- Dashboard analytics (check history over time)

---

## Verification Plan

After Phase 1:
1. `npm run lint` + `npm run build` — must pass
2. Navigate to `/admin` — dashboard loads, shows seeded sources
3. Click "Refresh All" — successfully fetches CRA URLs, stores snapshots
4. Manually change a source URL to a known-different page — hash_changed detected
5. Navigate to `/admin/audit` — all actions logged
6. Hit admin routes without auth — returns 401
7. User-facing pages unchanged — compliance calculations work exactly as before
