# Roadmap

## Current Phase

Phase: Structured MVP with dual workspaces

## Completed

- Next.js 14 App Router scaffold
- bilingual routing
- benefits/planning workspace
- tax estimator (2025 + 2026 brackets, BPA credit, RRSP cap)
- RRSP calculator
- recommendation engine
- Stripe pricing and checkout route
- Compliance Hub rules engine
- Compliance wizard
- Compliance dashboard
- homepage/workspace redesign
- dev lifecycle scripts for clean start/stop/status
- project documentation system
- structured planning and production-readiness docs
- all P0/P1 data accuracy bugs fixed (BPA, RRSP cap, NS HST, 2026 brackets, payroll penalty, WCB)
- data sourcing Phase 1 — source monitor admin dashboard live at `/en/admin`

## In Progress

- audience and UX validation
- Phase 1 validation checklist execution
- WCB source URL verification in admin dashboard

## Pending

- data sourcing Phase 2 — `compliance_values` table + propose/approve/publish workflow in admin dashboard
- data sourcing Phase 3 — replace Vercel Cron with Claude Managed Agent session for automated weekly source checks, hash diffing, and compliance value change proposals (requires Phase 2 complete; Anthropic Managed Agents API in beta as of April 2026)
- deeper Supabase persistence workflows
- subscription-aware feature unlocking
- compliance data source audit for TODO-marked entries (AB WCB, BC WCB)
- richer operator onboarding based on business stage
- analytics / product validation instrumentation
- Stripe webhook fulfillment and subscription sync
- production error handling, instrumentation, and security headers

## Corporate Structure — CanStack as Umbrella Org

Decision made 2026-09-21 (revised same day from an earlier "third workspace" plan — see history below): **CanStack is the parent/legal entity** the user plans to incorporate under. Every customer-facing offering is a **separate product/app/website** underneath it — not a workspace inside one app. Modeled explicitly on Gap Inc. (parent) owning Old Navy, Banana Republic, etc. (distinct customer-facing brands), sharing back-end infrastructure but not audience, brand, or codebase.

Planned products under the CanStack umbrella:

1. **Contractor compliance/tax SaaS** (this repo's current product — `Start & Plan` + `Deadlines & Compliance`). Its customer-facing brand name is a separate open decision from the corporate name "CanStack" — not yet decided, not urgent to change today.
2. **Personal finance / investing education** — separate product, separate customer-facing app/site, own brand name (TBD). See details below.
3. **Insurance aggregator** (like Ratehub) — separate product, requires the user to obtain a license first.

What's shared across products (the "Gap Inc logistics" layer): the source-of-truth / data-monitoring backbone (Phase 1 `data_sources`/`source_snapshots`/`audit_log` system), and potentially a shared design system or billing infra later. What's NOT shared: audience, brand identity, navigation, or codebase.

**Why this over one-app-with-workspaces**: the compliance SaaS's audience (contractor operators, premium vertical SaaS tone — Golden Rules UX Rule 4) doesn't mix cleanly with the finance-education audience (mass-market consumers). Separate products also make each one independently sellable, and compartmentalize regulatory exposure (a consumer-facing education/insurance product carries different regulatory scrutiny than a B2B-ish compliance tool) — see [[project_personal_brand_threads]] memory for full reasoning.

### Personal finance / investing education product

- **Education only, no personalized ticker/stock recommendations.** Teach frameworks (TFSA/RRSP/RESP mechanics, how to evaluate ETFs, robo vs. self-directed, etc.), never tell a specific user what to buy. See Golden Rules Product Rule 6.
- **Content source**: the user's own WhatsApp investing community (5+ years, recurring beginner questions) is the seeded content backlog — TFSA/RRSP/RESP contribution & transfer rules, self-directed vs. robo, US-ETF currency/withholding tax, dividend-date basics, all-in-one ETF (XEQT/VEQT/VGRO) selection, RRSP HBP rules.
- **Reference models**: investingforcanadians.ca (free tools/calculators/education → paid course) and "Canadian in a T-Shirt" YouTube content (free education → affiliate referrals) — see `docs/reference/canadianinatshirt-tfsa-transcripts.txt` for content-structure patterns (study structure/demand only, never reuse the copyrighted text itself).
- **Source-of-truth policy**: facts must trace only to tier-1 official sources (canada.ca/CRA, GetSmarterAboutMoney.ca, Bank of Canada, CMHC, provincial securities regulators, CIRO, FCAC) — see `.claude/skills/finance-navigator.md` for the full list.
- **Sequencing**: building this product follows Current Priorities #1 (finish this repo's Phase 1 validation first) — don't let it jump the queue.
- A persona/guardrail skill exists at `.claude/skills/finance-navigator.md` — consult it (`/finance-navigator`) when planning or building any part of this product.

## Future Phase 2 Exploration

- grant eligibility matcher
- newcomer business onboarding track
- document checklist generator
- reminder delivery flows (email / push)
- narrow affiliate placements inside relevant workflows
- multi-business support

## Next Recommended Steps

1. Use the UX evaluation template on the live product
2. Lock primary and secondary audience plus best first click
3. Audit all TODO-marked compliance entries against official sources
4. Build launch-readiness basics only after Phase 1 validation
