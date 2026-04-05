# Implementation Milestones

Last updated: March 16, 2026

## Purpose

This document converts the current roadmap and production-readiness spec into a practical implementation order.

It answers:

- what to do first
- what to delay
- what must be production-grade before paid launch

## Core Principle

Verdict: [VERIFIED]

Reasoning:

- The current repo docs consistently show that the main near-term risk is not missing features.
- The main near-term risks are:
  - unclear audience validation
  - unverified compliance data
  - incomplete launch/ops hardening

Source:

- [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md)
- [docs/stable/ROADMAP.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/ROADMAP.md)
- [docs/status/CURRENT_STATUS.md](/Users/balajik/projects/Canada_Conttractors/docs/status/CURRENT_STATUS.md)
- [docs/issues/KNOWN_ISSUES.md](/Users/balajik/projects/Canada_Conttractors/docs/issues/KNOWN_ISSUES.md)

## Recommended Path

### Phase 1. Validate The Product Direction

Verdict: [VERIFIED]

Goal:

- confirm that the current product framing is understandable and worth deepening

Work:

- run the UX evaluation template
- review homepage comprehension on desktop and mobile
- lock:
  - primary audience
  - secondary audience
  - best first click
  - default workspace

Exit criteria:

- one completed UX scorecard
- one written audience decision
- one written homepage action decision

Why this comes first:

- building deeper infrastructure before knowing which workflow is primary risks hardening the wrong product shape

### Phase 2. Harden The Compliance Dataset

Verdict: [VERIFIED]

Goal:

- eliminate unverified or ambiguous compliance outputs before public trust depends on them

Work:

- audit TODO-marked values
- verify each against official 2026 sources
- suppress unsupported outputs where evidence is missing

Exit criteria:

- no fabricated compliance outputs shown to users
- every user-visible number has a verified basis or is intentionally withheld

Why this comes second:

- the product is regulated-adjacent
- trust breaks faster on wrong compliance numbers than on missing advanced features

### Phase 3. Close Launch Readiness Gaps

Verdict: [VERIFIED]

Goal:

- make the product legally, operationally, and commercially safer to expose publicly

Work:

- privacy policy
- consent flow
- terms and disclaimer coverage
- affiliate/monetization boundary checks

Exit criteria:

- legal/privacy posture is documented
- data collection is consented and disclosed
- paid offering can be described without ambiguity

### Phase 4. Add Minimal Product Instrumentation

Verdict: [PLAUSIBLE]

Goal:

- collect just enough data to confirm user behavior

Work:

- first workspace click
- wizard start and completion
- pricing CTA click
- checkout initiation

Exit criteria:

- you can answer where users begin and where they drop off

Why this is not phase 1:

- the product framing must be stable enough to measure first

### Phase 5. Build Production Infrastructure For Paid Launch

Verdict: [VERIFIED]

Goal:

- make the app operationally safe for real users and payments

Work:

- Stripe webhooks and subscription sync
- route/global error handling
- instrumentation
- security headers
- backups/PITR confirmation
- domain and environment setup
- CI and tests

Exit criteria:

- paid users can be provisioned correctly
- failures are visible
- rollback/recovery is possible

Why this is not the first step:

- it is necessary before scale and paid launch
- it is not the first lever for finding product fit

## Decision: Validation Path Or Production Path?

### Correct answer

Verdict: [MISLEADING]

Correction:

- This is not an either/or decision.
- The correct sequence is:
  1. product validation first
  2. then targeted production hardening
  3. then paid/public launch hardening

### What to do right now

Verdict: [VERIFIED]

Recommended immediate order:

1. validate audience and workflow clarity
2. harden compliance data
3. close privacy/disclaimer/monetization gaps
4. add minimal analytics
5. implement production launch infrastructure

## Milestone Checklist

### Milestone A. Product Clarity

- [ ] Complete UX scorecard
- [ ] Decide primary audience
- [ ] Decide default workspace
- [ ] Decide best first click

### Milestone B. Trustworthy Data

- [ ] Audit all compliance TODOs
- [ ] Replace or suppress unverified values
- [ ] Review disclaimers for all penalty/premium outputs

### Milestone C. Launch Hygiene

- [ ] Draft privacy policy
- [ ] Draft terms/disclaimers
- [ ] Add consent flow for profile/quiz data
- [ ] Confirm affiliate/legal boundaries

### Milestone D. Learning Loop

- [ ] Add analytics for first-click behavior
- [ ] Add analytics for wizard completion
- [ ] Add analytics for pricing/checkout starts

### Milestone E. Paid Launch Infrastructure

- [ ] Implement Stripe webhooks
- [ ] Persist subscription state
- [ ] Add `error.tsx` and `global-error.tsx`
- [ ] Add instrumentation/logging
- [ ] Add security headers/CSP
- [ ] Confirm backups/PITR
- [ ] Set production domain and envs
- [ ] Add CI/test baseline

## Suggested Build Order By Workstream

### Product

1. homepage validation
2. workspace decision
3. onboarding refinement

### Compliance

1. rate and wage verification
2. UI suppression for unsupported values
3. source documentation

### Platform

1. Stripe webhooks
2. error handling and logging
3. security headers
4. tests and CI
5. domain and launch setup

## Anti-Patterns

### Building more features before validation

Verdict: [MISLEADING]

Correction:

- more tools will not solve unclear product positioning

### Hardening everything before validating the workflow

Verdict: [MISLEADING]

Correction:

- full production hardening is necessary before broad paid launch, not before learning whether the workflow is right

### Launching paid traffic before webhook/subscription sync

Verdict: [VERIFIED]

Reasoning:

- Stripe explicitly documents webhook-based fulfillment as the reliable path after Checkout

Source:

- [Stripe Checkout fulfillment](https://docs.stripe.com/checkout/fulfillment)
