# Phase 1 User Test Plan

Last updated: March 16, 2026

## Purpose

This plan is the smallest useful user-validation layer for CanStack Phase 1.

It is designed to answer:

- who users think the product is for
- what users think the product does
- what users would click first
- whether the homepage should prioritize:
  - `Start & Plan`
  - `Deadlines & Compliance`
  - or a stage-based entry model

## Why This Test Exists

> **Claim:** "The current homepage is directionally strong, but the CTA and audience clarity are not fully validated."
> **Reasoning:** The audited homepage evaluation found that the current shell is coherent, but the audience language and CTA hierarchy still require real user observation.
> **Verdict:** [VERIFIED — SOURCE: [docs/decisions/PHASE_1_HOMEPAGE_EVALUATION.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PHASE_1_HOMEPAGE_EVALUATION.md)]

## Test Type

### 1. 5-second comprehension test

Goal:

- measure first-impression clarity

### 2. First-click test

Goal:

- learn what users naturally select as their next action

## Recommended Sample

> **Claim:** "Three to five users is enough for this phase."
> **Reasoning:** For early directional UX feedback, a small sample is often enough to expose major comprehension issues, but it is not enough for statistical confidence.
> **Verdict:** [PLAUSIBLE — REASON: A small qualitative sample is appropriate for early signal, but it is not a quantitative benchmark.]

Recommended participants:

- 2 self-employed solo operators
- 1 incorporated consultant or contractor
- 1 person with payroll or subcontractor admin exposure
- optional: 1 non-target participant to detect wording confusion

## Test Setup

### Device coverage

- [ ] desktop/laptop
- [ ] mobile width

### Preparation

- [ ] use the current live homepage
- [ ] do not explain the product before the test
- [ ] do not define the workspaces for the participant
- [ ] record answers exactly as spoken

## Test Script

## Part A. 5-Second Test

Show the homepage for 5 seconds only.
Then hide it and ask:

1. Who is this product for?
2. What does this product do?
3. What do you remember most?

## Part B. Reopen The Homepage

Now show the page again and ask:

4. What would you click first?
5. Why would you click that?
6. What do you think `Start & Plan` means?
7. What do you think `Deadlines & Compliance` means?

## Part C. Confidence / Trust

8. Does this feel like a serious product or a concept?
9. Would you trust this with your planning or deadline tracking? Why or why not?
10. What feels unclear or risky?

## Part D. Optional Follow-Up

11. If you were just getting set up, where would you go first?
12. If you already had recurring tax/payroll obligations, where would you go first?

## What To Record

For each participant, record:

- audience they inferred
- product function they inferred
- first click
- reason for first click
- whether they interpreted the product as:
  - planning-first
  - compliance-first
  - mixed/unclear
- trust concerns
- confusing words

## Analysis Framework

## Question 1. Is the audience clear?

Success condition:

- most participants independently identify a self-employed / one-person business / contractor-operator audience

Failure signals:

- people say:
  - "small businesses in general"
  - "accountants"
  - "insurance shoppers"
  - "employers only"
  - "not sure"

## Question 2. Is the product value clear?

Success condition:

- most participants say some version of:
  - planning plus deadlines
  - business admin plus compliance
  - benefits/tax plus recurring obligations

Failure signals:

- they only remember benefits
- they only remember compliance
- they think it is a quote marketplace
- they cannot explain what the product actually does

## Question 3. What is the natural first click?

Success condition:

- a clear majority trend emerges:
  - `Start & Plan`
  - `Deadlines & Compliance`
  - or a need for stage-based routing

Failure signals:

- click choices are scattered
- participants need explanation before choosing
- participants choose pricing before understanding the product

## Decision Rules

> **Claim:** "If participants are split, use a stage selector or more explicit routing."
> **Reasoning:** If users do not converge naturally on one workspace, the current CTA hierarchy may be imposing an internal product model instead of matching user intent.
> **Verdict:** [PLAUSIBLE — REASON: This is a reasonable UX response, but it should be validated by the actual observed split.]

Interpretation:

- If most early-stage users choose `Start & Plan`, lead with planning.
- If most users with admin burden choose compliance and early-stage users still choose planning, a stage selector may be better than a single hardcoded primary CTA.
- If users cannot explain the difference between the workspaces, fix the copy before changing more structure.

## Output Template

After running the test, fill in:

### Participants

- total tested:
- target-like participants:
- non-target participants:

### Audience understanding

- clear:
- mixed:
- unclear:

### First-click pattern

- `Start & Plan`:
- `Deadlines & Compliance`:
- `Pricing`:
- other:

### Main confusion points

1.
2.
3.

### Trust issues mentioned

1.
2.
3.

### Decision

- keep current CTA hierarchy
- switch primary CTA to `Start & Plan`
- introduce stage selector
- rewrite audience/hero copy first

## Phase 1 Success Criteria

This test is successful if it resolves:

- whether the current audience framing is understood
- whether the current workspace model is understood
- whether the primary CTA hierarchy should change

## Important Limits

> **Claim:** "This test will prove product-market fit."
> **Reasoning:** A small comprehension and first-click test only reveals clarity and initial navigation behavior. It does not prove long-term value, retention, or willingness to pay.
> **Verdict:** [MISLEADING — CORRECTION: This test is useful for homepage clarity and workflow-entry decisions only. It is not evidence of product-market fit.]
