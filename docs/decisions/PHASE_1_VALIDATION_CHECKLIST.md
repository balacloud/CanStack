# Phase 1 Validation Checklist

Last updated: March 16, 2026

## Purpose

This checklist is the execution guide for the first phase of CanStack.

Phase 1 is not about adding more features.
Phase 1 is about validating:

- who the product is for
- whether the current homepage and workspace structure are clear
- whether the current compliance experience is trustworthy enough to deepen

## Phase 1 Goal

Verdict: [VERIFIED]

Reasoning:

- Current project docs identify audience clarity, workflow clarity, and compliance-data confidence as the immediate open risks.

Source:

- [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md)
- [docs/stable/ROADMAP.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/ROADMAP.md)
- [docs/status/CURRENT_STATUS.md](/Users/balajik/projects/Canada_Conttractors/docs/status/CURRENT_STATUS.md)
- [docs/issues/KNOWN_ISSUES.md](/Users/balajik/projects/Canada_Conttractors/docs/issues/KNOWN_ISSUES.md)

## What Success Looks Like

- primary audience is explicitly locked
- secondary audience is explicitly locked
- homepage first-click path is explicitly locked
- default workspace is explicitly locked
- UX scorecard is completed
- top 3 product clarity problems are written down
- current compliance data gaps are ranked for verification

## Workstream A. UX Evaluation

### Task A1. Score The Current Product

- [ ] Open the live product on desktop
- [ ] Open the live product on mobile width
- [ ] Complete [UX_EVALUATION_TEMPLATE.md](/Users/balajik/projects/Canada_Conttractors/UX_EVALUATION_TEMPLATE.md)

Required outputs:

- total score out of 40
- primary audience sentence
- secondary audience sentence
- primary job-to-be-done
- best first click
- top 3 problems
- top 3 next changes

Decision rule:

- [ ] If score is below 22, pause new feature work
- [ ] If score is 22 to 29, refine messaging and entry flow before deepening infrastructure
- [ ] If score is 30+, proceed to the next validation tasks and then into production-hardening prep

### Task A2. Run A 5-Second Comprehension Test

Verdict: [PLAUSIBLE]

Reasoning:

- This is a common UX validation technique for message clarity, but the exact method is not mandated by repo docs.

Checklist:

- [ ] Show the homepage to at least 3 people
- [ ] Ask each person:
  - who is this for?
  - what does it do?
  - what would you click first?
- [ ] Record the answers without explaining the page

What to capture:

- confusion on audience
- confusion on workspace labels
- pricing click before product understanding

## Workstream B. Product Positioning Lock

### Task B1. Lock Audience Definition

- [ ] Write one primary audience sentence
- [ ] Write one secondary audience sentence
- [ ] Write one primary job-to-be-done
- [ ] Write one secondary job-to-be-done

Target files to update after decision:

- [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md)
- [docs/status/CURRENT_STATUS.md](/Users/balajik/projects/Canada_Conttractors/docs/status/CURRENT_STATUS.md)

### Task B2. Lock The Homepage Action Model

- [ ] Decide the best first click
- [ ] Decide the default workspace emphasis
- [ ] Decide whether the homepage needs a stage-based entry prompt

Decision options:

- `Start & Plan` first
- `Deadlines & Compliance` first
- stage selector first

Verdict: [UNVERIFIED]

Needs:

- UX scorecard result
- lightweight observation or user feedback

## Workstream C. Compliance Trust Audit

### Task C1. Create A Verification Inventory

- [ ] List every TODO or unverified compliance value
- [ ] Group them by severity:
  - user-visible and risky
  - user-visible but low-risk
  - hidden/internal only

Suggested audit targets:

- WSIB / WCB rates
- minimum wages
- filing assumptions
- province-specific caveats

### Task C2. Decide Output Policy For Unverified Values

- [ ] For each unverified value, choose one:
  - verify and keep
  - suppress in UI
  - keep behind disclaimer only if non-personal and low-risk

Verdict: [VERIFIED]

Reasoning:

- The project already uses intentional suppression for some unsupported compliance outputs.
- This is consistent with the repo’s no-hallucination rule for regulated-adjacent data.

Source:

- [docs/stable/GOLDEN_RULES.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/GOLDEN_RULES.md)

## Workstream D. Immediate Launch-Risk Triage

### Task D1. Write The Must-Have Launch Gap List

- [ ] Privacy policy missing?
- [ ] Consent flow missing?
- [ ] Terms/disclaimers incomplete?
- [ ] Stripe webhook provisioning missing?
- [ ] Error handling missing?
- [ ] Security headers missing?

Target reference:

- [docs/decisions/PRODUCTION_READINESS_SPEC.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PRODUCTION_READINESS_SPEC.md)

Goal:

- do not implement all of these yet
- just make the launch-risk list explicit and ranked

## Files Most Likely To Change In Phase 1

### Evaluation / decision docs

- [UX_EVALUATION_TEMPLATE.md](/Users/balajik/projects/Canada_Conttractors/UX_EVALUATION_TEMPLATE.md)
- [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md)
- [docs/status/CURRENT_STATUS.md](/Users/balajik/projects/Canada_Conttractors/docs/status/CURRENT_STATUS.md)
- [docs/issues/KNOWN_ISSUES.md](/Users/balajik/projects/Canada_Conttractors/docs/issues/KNOWN_ISSUES.md)
- [docs/stable/ROADMAP.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/ROADMAP.md)

### Product files only if a validated decision is made

- [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)
- [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json)
- [messages/fr.json](/Users/balajik/projects/Canada_Conttractors/messages/fr.json)
- [components/compliance-wizard.tsx](/Users/balajik/projects/Canada_Conttractors/components/compliance-wizard.tsx)
- [components/compliance-dashboard.tsx](/Users/balajik/projects/Canada_Conttractors/components/compliance-dashboard.tsx)
- [lib/compliance-rules.ts](/Users/balajik/projects/Canada_Conttractors/lib/compliance-rules.ts)

## What Not To Do In Phase 1

### Do not broaden scope into full production engineering yet

Verdict: [MISLEADING]

Correction:

- Full production hardening is necessary before launch, but Phase 1 should not get derailed into platform work before the product path is validated.

### Do not keep polishing UI without a measured decision

Verdict: [MISLEADING]

Correction:

- UI polish without a completed scorecard or user observation is likely churn.

### Do not expand features to solve positioning confusion

Verdict: [MISLEADING]

Correction:

- More features will not resolve unclear audience targeting.

## Exit Criteria For Phase 1

- [ ] UX scorecard completed
- [ ] Audience definition locked
- [ ] First-click strategy locked
- [ ] Workspace priority locked
- [ ] Compliance verification inventory created
- [ ] Top launch-risk list created
- [ ] Next phase decision written

## Next Phase After Completion

If Phase 1 succeeds, move to:

- compliance data hardening
- privacy/consent/disclaimer work
- minimal instrumentation

Then move to:

- webhook-based billing
- error handling
- observability
- security hardening
