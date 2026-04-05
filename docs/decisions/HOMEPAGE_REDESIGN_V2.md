# Homepage Redesign V2

Last updated: March 20, 2026

## Purpose

This document defines the next homepage redesign pass for CanStack.

It is intentionally narrow.
It only addresses the homepage/top-shell problems identified in Phase 1.

## Inputs

- [docs/stable/AUDIT_FRAMEWORK.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/AUDIT_FRAMEWORK.md)
- [docs/decisions/PHASE_1_HOMEPAGE_EVALUATION.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PHASE_1_HOMEPAGE_EVALUATION.md)
- [docs/decisions/PHASE_1_MARKET_STUDY.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PHASE_1_MARKET_STUDY.md)
- screenshots and interaction feedback from this thread

## Core Problem Statement

> **Claim:** "The homepage currently contains too many competing elements at the top."
> **Reasoning:** The current top section includes:
> - headline and subtitle
> - multiple trust chips
> - trust row
> - two CTA buttons
> - operator snapshot
> - stage selector inside the snapshot
> - duplicated stage selector below the hero
> This creates a hierarchy problem and unnecessary choice friction.
> **Verdict:** [VERIFIED — SOURCE: current implementation in [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx), screenshots provided in this thread]

> **Claim:** "The page is broken because it is not responsive."
> **Reasoning:** The screenshots do not show classic responsive breakage such as overflow or clipping. The issue is composition, density, and hierarchy on large and likely small screens.
> **Verdict:** [MISLEADING — CORRECTION: The page is technically responsive but not yet well-composed for desktop and likely not yet optimized enough for mobile decision-making.]

## Redesign Goal

Create a clearer homepage that:

- presents CanStack as one product
- centers the two core modes:
  - `Start & Plan`
  - `Deadlines & Compliance`
- reduces misleading or redundant UI
- improves desktop composition
- reduces mobile overload

## Design Principles For This Pass

### 1. One decision, once

> **Claim:** "The stage decision should only appear once in the hero area."
> **Reasoning:** Repeating the same choice in two separate controls creates ambiguity and lowers hierarchy clarity.
> **Verdict:** [VERIFIED — SOURCE: current duplicate stage controls in screenshots and [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)]

Rule:

- keep only one stage-selection control group above the fold

### 2. Trust markers must not look clickable

> **Claim:** "The current trust chips are being read as actions."
> **Reasoning:** A real user in this thread attempted to click them. Their current visual treatment looks interactive.
> **Verdict:** [VERIFIED — SOURCE: user feedback in this thread]

Rule:

- replace trust chips with plain trust bullets or small non-pill labels

### 3. Left explains, right demonstrates

> **Claim:** "The hero left side and right side should not do the same job."
> **Reasoning:** The left side already carries the brand promise. The right side should either preview the product or guide next action, not repeat the same message.
> **Verdict:** [VERIFIED — SOURCE: screenshots in this thread]

Rule:

- left = product promise
- right = product preview or stage chooser
- not both repeated

### 4. Reduce top-of-page density

> **Claim:** "The current hero is too dense."
> **Reasoning:** Multiple visual systems and repeated decisions appear before the user has committed to a direction.
> **Verdict:** [PLAUSIBLE — REASON: Strongly supported by the current screenshots and interaction feedback, though user testing should still confirm the exact best replacement.]

Rule:

- fewer elements
- stronger grouping
- clearer action hierarchy

## Recommended New Structure

## Hero Layout

### Left column

Keep:

- eyebrow
- headline
- one short subtitle

Change:

- remove chip clusters
- replace with max 3 trust bullets
- keep one primary CTA and one secondary CTA only if both are truly needed

Recommended content structure:

1. Eyebrow
2. Headline
3. Subtitle
4. Trust bullets
5. Stage choice

### Right column

Use for:

- compact product preview

Do not use for:

- repeating the hero message
- second stage selector
- redundant explanatory copy

Recommended preview contents:

- one sample compliance card
- one sample planning metric
- one short note that this is one operator workspace across stages

## Remove / Replace

### Remove

- duplicate stage selector below the hero
- clickable-looking trust chips
- repeated explanatory copy in the right card

### Replace with

- one trust bullet row:
  - `Canadian rules, hardcoded locally`
  - `No fake compliance APIs`
  - `Built for self-employed operators`

## CTA Strategy

> **Claim:** "The homepage should definitely use one CTA only."
> **Reasoning:** Some comparables do this, but CanStack’s product still has two legitimate entry modes for the same user journey.
> **Verdict:** [UNVERIFIED — NEEDS: first-click testing and stage-comprehension testing]

Current design recommendation:

- primary CTA:
  - whichever mode wins testing
- secondary CTA:
  - the other mode

Fallback option:

- two large stage cards used once, directly below the subtitle

Do not do:

- one CTA group plus a second duplicated selector below

## Mobile Structure

### Mobile order

1. Eyebrow
2. Headline
3. Subtitle
4. One stage-selection group
5. Trust bullets
6. Compact preview

### Mobile rules

- no duplicate controls
- no multi-row chip clutter
- one clear action group visible early
- right-column content stacks below and stays short

## Desktop Structure

### Desktop order

Left:

- message
- trust
- stage/action

Right:

- compact preview card

### Desktop rules

- expand composition width slightly
- use space for cleaner grouping, not more elements
- avoid large empty background around a compact central block

## Suggested Wireframe

```text
┌────────────────────────────────────────────────────────────┐
│ CanStack                                   FR   Pricing   │
├───────────────────────────────┬────────────────────────────┤
│ Self-employed Canada          │ Preview panel              │
│                               │ - sample metric            │
│ Run your contractor business  │ - sample compliance item   │
│ with more confidence.         │ - short contextual note    │
│                               │                            │
│ Plan benefits and taxes, or   │                            │
│ stay ahead of deadlines and   │                            │
│ compliance.                   │                            │
│                               │                            │
│ · Canadian rules, local logic │                            │
│ · No fake compliance APIs     │                            │
│ · Built for self-employed     │                            │
│                               │                            │
│ [Start & Plan] [Deadlines &   │                            │
│                Compliance]    │                            │
└───────────────────────────────┴────────────────────────────┘
```

## Exact Problems This Pass Must Solve

1. trust items look clickable
2. stage choice is duplicated
3. right panel overlaps left-panel message
4. top shell is too dense
5. desktop composition feels under-expressive

## Files Likely Affected

- [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)
- [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json)
- [messages/fr.json](/Users/balajik/projects/Canada_Conttractors/messages/fr.json)

## Success Criteria

- stage choice appears once
- trust items are not mistaken for buttons
- right panel adds new value instead of repeating
- hero is visually simpler
- mobile and desktop both feel less cluttered

## What This Pass Does Not Decide

- final logo system
- final brand visual identity
- long-term pricing strategy
- deeper product flow changes beyond the homepage shell
