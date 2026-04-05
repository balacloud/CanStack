# Next 2 Weeks Plan

Last updated: March 16, 2026

## Purpose

This plan turns the current roadmap and audited next steps into an execution sequence for the next 14 days.

## Decision Standard

All decisions in this file should be reviewed using the project audit protocol in:

- [docs/stable/GOLDEN_RULES.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/GOLDEN_RULES.md)

## Current Inputs

- [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md)
- [docs/stable/ROADMAP.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/ROADMAP.md)
- [docs/status/CURRENT_STATUS.md](/Users/balajik/projects/Canada_Conttractors/docs/status/CURRENT_STATUS.md)
- [docs/issues/KNOWN_ISSUES.md](/Users/balajik/projects/Canada_Conttractors/docs/issues/KNOWN_ISSUES.md)
- [docs/decisions/Audited_NextSteps.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/Audited_NextSteps.md)

## Priority Order

### 1. UX Validation

Verdict: [VERIFIED]

Reasoning:

- The roadmap explicitly lists audience and UX validation as in progress.
- Known issues explicitly state that positioning is improved but not yet user-validated.

Actions:

- Complete [UX_EVALUATION_TEMPLATE.md](/Users/balajik/projects/Canada_Conttractors/UX_EVALUATION_TEMPLATE.md) on desktop and mobile.
- Record:
  - total score
  - primary audience
  - secondary audience
  - best first click
  - top 3 UX problems
- Decide whether the product score is:
  - below 22
  - 22 to 29
  - 30+

Definition of done:

- One completed scorecard
- One written decision on primary audience
- One written decision on best homepage first action

### 2. Product Positioning Lock

Verdict: [VERIFIED]

Reasoning:

- Current docs consistently say product clarity matters more than broad feature expansion.
- The site already moved to a two-workspace model, but the audience still needs to be locked more explicitly.

Actions:

- Confirm:
  - primary audience
  - secondary audience
  - primary job-to-be-done
  - secondary job-to-be-done
  - best default workspace
- Update:
  - [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md)
  - [docs/status/CURRENT_STATUS.md](/Users/balajik/projects/Canada_Conttractors/docs/status/CURRENT_STATUS.md)

Definition of done:

- Product identity is written as one operator journey, not two stitched modules.

### 3. Compliance Data Hardening

Verdict: [VERIFIED]

Reasoning:

- Known issues list TODO-marked compliance entries as an open production gap.
- Current status also lists these as blockers.

Actions:

- Audit all TODO and unverified compliance entries against official 2026 sources.
- Priority order:
  - WSIB / WCB rates
  - minimum wages
  - province-specific filing and deadline caveats
- Replace placeholders with:
  - verified values, or
  - explicit suppression in UI when values cannot be verified

Definition of done:

- No user-visible fabricated compliance values
- Every remaining gap is intentionally suppressed or documented

### 4. Legal and Monetization Readiness

Verdict: [VERIFIED]

Reasoning:

- [docs/decisions/Audited_NextSteps.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/Audited_NextSteps.md) identifies these as the practical business-readiness gaps before scaling monetization.

Actions:

- Prepare:
  - privacy policy
  - terms of service
  - disclaimers for tax/compliance estimates
  - quiz/profile consent copy
- Confirm affiliate path assumptions before launch monetization.

Definition of done:

- Product can collect minimal profile data with documented consent flow
- Public-facing legal docs exist in draft form

### 5. Light Product Instrumentation

Verdict: [PLAUSIBLE]

Reasoning:

- This is consistent with the roadmap and current blockers.
- The exact event set is not mandated by a platform doc, but it is the minimum sensible measurement layer for current product questions.

Actions:

- Add analytics for:
  - first workspace click
  - wizard start/completion
  - pricing click-through
  - checkout initiation
- Keep analytics narrowly scoped to product decisions.

Definition of done:

- Team can answer where users start and where they drop

### 6. Persistence and Paid Gating

Verdict: [VERIFIED]

Reasoning:

- The roadmap already places deeper persistence and subscription-aware unlocking after validation and data hardening.

Actions:

- Improve Supabase persistence only after the first five items are underway or done.
- Make feature unlocking reflect actual subscription state, not static gated UI only.

Definition of done:

- Saved state and paid feature access reflect real user/account status

## Suggested 14-Day Schedule

### Days 1-3

- Run UX evaluation
- Lock audience and first-click decision

### Days 4-7

- Audit compliance TODOs and unverified entries
- Suppress or replace anything not supported by official sources

### Days 8-10

- Draft privacy policy, terms, and consent/disclaimer language
- Confirm monetization assumptions and affiliate boundaries

### Days 11-12

- Add minimal analytics instrumentation

### Days 13-14

- Plan persistence and subscription-aware gating implementation
- Re-rank roadmap based on what was learned

## Not Recommended This Sprint

### More broad UI redesign

Verdict: [MISLEADING]

Correction:

- Another broad redesign before validation would likely create churn, not clarity.

### More feature expansion

Verdict: [MISLEADING]

Correction:

- Current constraints are audience clarity, data confidence, and launch readiness, not feature count.

## End-of-Period Deliverables

- completed UX scorecard
- locked audience definition
- locked first-click strategy
- hardened compliance dataset
- basic legal/privacy docs drafted
- analytics plan or minimal implementation in place
- updated roadmap for the next sprint
