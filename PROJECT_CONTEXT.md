# Project Context

## Corporate Structure (added 2026-09-21)

"CanStack" is the user's planned parent/legal incorporation entity, not necessarily this product's customer-facing brand name. This repo holds one product under that umbrella — the contractor compliance/tax SaaS described below. Other planned sibling products (personal finance/investing education, an insurance aggregator) are separate apps/brands under the same umbrella — see `docs/stable/ROADMAP.md` ("Corporate Structure — CanStack as Umbrella Org"). This product's own customer-facing brand name (whether it stays "CanStack" or becomes something else) is an open decision, not yet made.

## Current Product

CanStack is a Canadian contractor operating platform for self-employed users who need:

- benefits and planning guidance
- tax visibility
- payroll and sales tax deadline tracking
- provincial compliance reminders

The product is currently structured as one SaaS product with two operational stages:

- `Start & Plan`
- `Deadlines & Compliance`

## Primary Audience

Self-employed Canadian business operators, including:

- solo freelancers
- independent contractors
- incorporated consultants
- operators managing their own business administration

## Secondary Audience

Established contractor-business operators who may have:

- GST/HST obligations
- payroll obligations
- subcontractor reporting exposure
- WCB / WSIB obligations

## Current Product Positioning

Preferred framing:

- `Run your contractor business with more confidence.`

The site should feel like:

- one professional SaaS product
- serving different operator maturity stages

It should not feel like:

- two stitched products
- a generic affiliate landing page

## Current Priorities

1. Complete Phase 1 validation before deeper product or infrastructure expansion
2. Validate audience clarity, homepage comprehension, and first-click behavior
3. Harden compliance data by verifying or suppressing TODO/unverified values
4. Keep compliance logic deterministic and hardcoded
5. Avoid architectural drift and fake integrations

## Current Verification Standard

Before considering work complete:

- `npm run lint`
- `npm run build`

Both should pass unless the user explicitly requests otherwise.

## Key Current Docs

- Session protocol: [docs/stable/SESSION_PROTOCOL.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/SESSION_PROTOCOL.md)
- Stable rules: [docs/stable/GOLDEN_RULES.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/GOLDEN_RULES.md)
- Audit framework: [docs/stable/AUDIT_FRAMEWORK.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/AUDIT_FRAMEWORK.md)
- Roadmap: [docs/stable/ROADMAP.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/ROADMAP.md)
- API contracts: [docs/stable/API_CONTRACTS.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/API_CONTRACTS.md)
- Current status: [docs/status/CURRENT_STATUS.md](/Users/balajik/projects/Canada_Conttractors/docs/status/CURRENT_STATUS.md)
- Known issues: [docs/issues/KNOWN_ISSUES.md](/Users/balajik/projects/Canada_Conttractors/docs/issues/KNOWN_ISSUES.md)
- Next 2 weeks plan: [docs/decisions/NEXT_2_WEEKS_PLAN.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/NEXT_2_WEEKS_PLAN.md)
- Production readiness spec: [docs/decisions/PRODUCTION_READINESS_SPEC.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PRODUCTION_READINESS_SPEC.md)
- Implementation milestones: [docs/decisions/IMPLEMENTATION_MILESTONES.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/IMPLEMENTATION_MILESTONES.md)
- Phase 1 validation checklist: [docs/decisions/PHASE_1_VALIDATION_CHECKLIST.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PHASE_1_VALIDATION_CHECKLIST.md)
- Roadmap audit from Perplexity: [docs/decisions/ROADMAP_AUDIT_FROM_PERPLEXITY.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/ROADMAP_AUDIT_FROM_PERPLEXITY.md)
- Session notes: [CANSTACK_SESSION_NOTES.md](/Users/balajik/projects/Canada_Conttractors/CANSTACK_SESSION_NOTES.md)
