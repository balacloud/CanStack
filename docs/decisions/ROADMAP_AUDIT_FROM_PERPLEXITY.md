# Roadmap Audit From Perplexity

Last updated: March 24, 2026

## Purpose

This document audits a set of roadmap suggestions gathered from Perplexity against:

- current CanStack scope
- current product priorities
- current roadmap sequencing
- the project audit framework

## Inputs

- Perplexity summary provided in this thread
- [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md)
- [docs/stable/ROADMAP.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/ROADMAP.md)
- [docs/decisions/IMPLEMENTATION_MILESTONES.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/IMPLEMENTATION_MILESTONES.md)
- official Canada funding/support page: [Getting business support and financing - Canada.ca](https://www.canada.ca/en/services/business/start/support-financing.html)
- official CRA business registration overview: [Business Registration Online overview - Canada.ca](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/registering-your-business/business-registration-online-overview.html)
- official federal corporation registration page: [Registering a corporation - Canada.ca](https://www.canada.ca/en/services/business/start/register-with-gov/register-corp.html)

## Audited Suggestions

> **Claim:** "CRA deadline engine is a next missing feature."
> **Reasoning:** The product already contains a deterministic compliance engine that generates payroll and sales-tax deadlines and merges them into a compliance calendar. The gap is breadth and source-hardening, not absence of an engine.
> **Verdict:** [MISLEADING — CORRECTION: A compliance deadline engine already exists. The remaining work is expanding coverage, improving business-type logic, and verifying source completeness. SOURCE: [lib/compliance-engine.ts](/Users/balajik/projects/Canada_Conttractors/lib/compliance-engine.ts), [docs/stable/ROADMAP.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/ROADMAP.md)]

> **Claim:** "Compliance calendar is still a next feature."
> **Reasoning:** The current product already has a compliance dashboard with a next-30-days view and a full calendar section.
> **Verdict:** [MISLEADING — CORRECTION: The compliance calendar already exists. The real next work is better unlock logic, reliability, and data hardening. SOURCE: [components/compliance-dashboard.tsx](/Users/balajik/projects/Canada_Conttractors/components/compliance-dashboard.tsx)]

> **Claim:** "Email/push reminders are a good next feature."
> **Reasoning:** Reminder delivery fits the core job-to-be-done of a deadline product and can improve retention. But it also introduces notification infrastructure, user preferences, delivery reliability, and privacy/consent work.
> **Verdict:** [PLAUSIBLE — REASON: This is a strong Phase 2 candidate after validation, compliance-source hardening, and launch-readiness basics.]

> **Claim:** "Business profile builder is a next missing feature."
> **Reasoning:** The product already includes a compliance wizard that captures core business-profile inputs and persists them conditionally.
> **Verdict:** [MISLEADING — CORRECTION: A business-profile flow already exists. The better next step is profile refinement and stronger persistence, not introducing the concept from scratch. SOURCE: [components/compliance-wizard.tsx](/Users/balajik/projects/Canada_Conttractors/components/compliance-wizard.tsx)]

> **Claim:** "Document checklist generator is a good next feature."
> **Reasoning:** A deterministic checklist generator is aligned with the current product model: rule-based, non-advisory, and operational. It extends compliance usefulness without requiring fake APIs.
> **Verdict:** [PLAUSIBLE — REASON: This fits CanStack well as a future depth/retention feature, but should come after current core validation and compliance-data hardening.]

> **Claim:** "Grant eligibility matcher should be added."
> **Reasoning:** Canada does have official funding/support discovery infrastructure for businesses, so the category is real. But CanStack is currently a contractor planning and compliance product, not a general SMB funding-discovery product. Adding grants now risks product drift.
> **Verdict:** [MISLEADING — CORRECTION: Grant matching is a valid adjacent opportunity, but not a near-term feature for the current product. It belongs in future Phase 2 exploration only if the product broadens into business-support discovery. SOURCE: [Getting business support and financing - Canada.ca](https://www.canada.ca/en/services/business/start/support-financing.html), [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md)]

> **Claim:** "Newcomer business onboarding track should be added."
> **Reasoning:** The underlying workflows are real: business registration, BN registration, corporation setup, and tax registrations. But “newcomers” is a distinct audience segment, and adding a dedicated newcomer journey now would widen the product before the current core audience is fully validated.
> **Verdict:** [MISLEADING — CORRECTION: This is a legitimate future segment expansion, not a near-term feature. It belongs in Phase 2 exploration only after the main self-employed operator journey is validated. SOURCE: [Business Registration Online overview - Canada.ca](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/registering-your-business/business-registration-online-overview.html), [Registering a corporation - Canada.ca](https://www.canada.ca/en/services/business/start/register-with-gov/register-corp.html)]

> **Claim:** "Affiliate integrations inside compliance steps are a good next monetization move."
> **Reasoning:** This is possible, but risky. Compliance flows depend on trust. If monetized placements are inserted too aggressively into compliance guidance, the product may feel less authoritative and more affiliate-driven.
> **Verdict:** [PLAUSIBLE — REASON: Narrow, relevant affiliate placements may work later, but they should not distort the trust model of the compliance product.]

> **Claim:** "Pro tier with saved profiles and multi-business support should come next."
> **Reasoning:** Saved profiles align closely with existing flows and monetization. Multi-business support is also plausible, but significantly more complex in data model, UX, and permissions.
> **Verdict:** [PLAUSIBLE — REASON: Saved profiles are a strong near-future fit; multi-business support is better treated as a later expansion.]

## Best Fit For Nearer-Term Roadmap

- reminders
- better persistence / saved profiles
- checklist generator
- analytics / retention instrumentation

## Future Phase 2 Exploration

- grant eligibility matcher
- newcomer business onboarding track
- narrow affiliate placements inside relevant workflows
- multi-business support

## Final Decision

> **Claim:** "These suggestions should become immediate next-build items."
> **Reasoning:** The current roadmap and implementation milestones are clear that validation, data hardening, and launch readiness come first. Several suggestions are good, but they are mistimed if promoted ahead of current priorities.
> **Verdict:** [MISLEADING — CORRECTION: These ideas should be split into current fit vs later exploration. The best additions for future Phase 2 exploration are `grant matcher` and `newcomer onboarding track`, while immediate priorities remain unchanged. SOURCE: [docs/stable/ROADMAP.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/ROADMAP.md), [docs/decisions/IMPLEMENTATION_MILESTONES.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/IMPLEMENTATION_MILESTONES.md)]
