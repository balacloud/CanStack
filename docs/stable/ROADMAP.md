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

- data sourcing Phase 2 — `compliance_values` propose/approve/publish workflow
- data sourcing Phase 3 — Vercel Cron for weekly automated source checks
- deeper Supabase persistence workflows
- subscription-aware feature unlocking
- compliance data source audit for TODO-marked entries (AB WCB, BC WCB)
- richer operator onboarding based on business stage
- analytics / product validation instrumentation
- Stripe webhook fulfillment and subscription sync
- production error handling, instrumentation, and security headers

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
