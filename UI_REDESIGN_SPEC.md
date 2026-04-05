# CanStack UI Redesign Spec

## Objective

Reposition CanStack from a benefits-only dashboard into a clear dual-workspace product:

- Benefits and Planning
- Compliance Hub

The redesign must improve:

- first-screen comprehension
- mobile discoverability
- task-oriented navigation
- user trust
- repeat-use dashboard usability

This spec does not assume the goal is "more visual polish." The primary goal is stronger information hierarchy and a clearer product model.

## Product Positioning

### Current Problem

The current hero communicates:

- benefits planning
- tax estimator
- RRSP planning

But the product now also includes:

- CRA payroll remittance scheduling
- sales tax deadline tracking
- provincial compliance deadline tracking

This creates a positioning mismatch. A user can land on the page and reasonably conclude that CanStack is a benefits tool with some tax calculators, not an operating hub for contractors.

### New Positioning

CanStack should be presented as:

`Benefits + Compliance for Canadian contractors`

Alternative framing:

`A contractor operating hub for benefits, taxes, and compliance`

## Redesign Principles

These principles are based on long-standing UX guidance rather than aesthetics alone:

- Clarity over cleverness
- Recognition over recall
- Strong first-screen value communication
- Progressive disclosure for advanced detail
- Mobile-first hierarchy
- Trust-first presentation for regulated-adjacent workflows
- Explicit separation of workspaces
- Fewer competing CTAs above the fold

## UX Diagnosis

### What Is Working

- Premium and trustworthy visual tone
- Good whitespace and readable typography
- Calm visual palette
- Distinct card system already exists
- Compliance Hub has been added without breaking the existing product

### What Is Not Working

- Hero still sells the older product definition
- Compliance Hub is visually secondary
- Overview is too generic as a workspace label
- The page still behaves like a landing page with modules rather than a product workspace
- Pricing CTA is more prominent than the second major product area
- On mobile, key workspaces are easy to miss below the hero

## Target Information Architecture

### Top-Level Product Model

Replace the current implied structure with an explicit two-workspace system:

1. Benefits and Planning
2. Compliance Hub
3. Pricing

### Navigation Structure

Header:

- logo / wordmark
- workspace switcher
- language switch
- pricing

Hero:

- product positioning
- one-sentence explanation
- primary CTA to enter workspace
- secondary CTA to compare plans

Workspace selector:

- Benefits and Planning
- Compliance Hub

This selector must appear above the fold on both desktop and mobile.

## Proposed Homepage Structure

### Section 1: Hero

Purpose:

- define what CanStack is
- communicate dual value proposition
- direct users into the right workspace quickly

Required content:

- eyebrow: `Canadian contractor operating hub`
- headline: `Benefits and compliance for Canadian contractors, in one dashboard.`
- supporting text: mention benefits recommendations, tax tools, payroll deadlines, and provincial compliance
- primary CTA: `Open Compliance Hub`
- secondary CTA: `Explore Benefits Tools`
- tertiary text link: `See pricing`

Badges should be updated to reflect the blended product:

- Hardcoded CRA and provincial compliance rules
- Benefits and planning workspace
- Mobile-first deadline tracking

### Section 2: Workspace Switcher

Purpose:

- make the two product areas unmistakable
- reduce cognitive effort

Design:

- larger segmented control or tab bar
- explanatory labels under each option

Example:

- Benefits and Planning
  - recommendations, tax estimate, RRSP room
- Compliance Hub
  - payroll, sales tax, provincial deadlines

This should not feel like a minor tab row. It should feel like the primary routing mechanism.

### Section 3: Active Workspace Surface

Only show one workspace at a time.

If `Benefits and Planning` is active:

- onboarding summary
- recommendation engine
- resource dashboard
- tax estimator
- RRSP calculator

If `Compliance Hub` is active:

- first-run wizard or saved profile summary
- next 30 days
- penalty forecaster
- full calendar preview
- quick links

This avoids mixing unrelated concepts on the same screen.

## Mobile-First Behavior

### Core Rule

Mobile is not a compressed desktop layout. It should be its own prioritized flow.

### Mobile Layout Order

1. logo / compact header
2. value proposition
3. workspace switcher
4. primary CTA
5. active workspace content
6. pricing entry

### Mobile Hero Requirements

- shorter headline
- max 2 lines of supporting copy before truncation risk
- only 1 primary CTA visible
- pricing demoted below workspace choice

### Mobile Workspace Pattern

- single column
- sticky workspace switcher after hero on scroll
- cards stacked with consistent spacing
- no three-column grid behavior on small screens

### Mobile Deadline Cards

Each card should show only:

- label
- due date
- urgency badge
- penalty warning
- mark done button

Secondary notes and disclaimers should be collapsible or visually lighter.

## Desktop Behavior

### Desktop Layout Goals

- maintain premium editorial feel
- improve operational clarity
- prevent scattered attention

### Desktop Hero

- left-heavy copy block
- right-side quick summary panel or workspace preview

The right-side panel should preview:

- next compliance deadline
- estimated tax snapshot
- recommended next action

This makes the hero more product-like and less purely marketing-driven.

### Desktop Workspace Layout

Benefits and Planning:

- left: recommendations
- right: summary metrics and resources
- lower row: tax and RRSP tools

Compliance Hub:

- left: next 30 days and full calendar preview
- right: penalty forecaster and quick links

## Copy Changes

### Replace

Current mental model:

- benefits planner

With:

- contractor operating hub

### Specific Copy Recommendations

Replace `Overview` with:

- `Benefits and Planning`

Keep:

- `Compliance Hub`

Replace hero subtitle with language that includes both planning and compliance. Example:

`CanStack helps Canadian contractors manage benefits planning, tax visibility, payroll remittance deadlines, and provincial compliance from one mobile-friendly dashboard.`

## Visual Direction

### Keep

- existing warm neutral background
- serif display typography
- teal as action color
- rounded surfaces

### Improve

- stronger contrast between marketing layer and application layer
- clearer active workspace styling
- more structured vertical rhythm
- less passive white space between hero and workspace controls

### Design Direction

The product should feel:

- editorial at the top
- operational in the workspace

That contrast helps users understand:

- what the product is
- what they can do inside it

## Component-Level Redesign Requirements

### 1. Header

Must include:

- CanStack wordmark
- workspace access
- language switch
- pricing

Desktop:

- horizontal alignment

Mobile:

- two-row stack if needed

### 2. Workspace Switcher

Must be:

- larger than current pills
- more descriptive
- visible without scrolling on common laptop heights

### 3. Hero CTAs

Current issue:

- Pricing competes with core product exploration

Fix:

- Primary CTA: open active workspace
- Secondary CTA: pricing

### 4. Benefits Cards

Improve with:

- clearer category labels
- one primary action per card
- shorter reasoning copy

### 5. Compliance Wizard

Refine with:

- clearer step framing
- more obvious progress state
- tighter spacing
- stronger button affordance
- reassurance text about what is and is not stored

### 6. Compliance Dashboard

Refine with:

- denser but readable card layout
- better urgency contrast
- cleaner locked-state overlay
- stronger distinction between free and paid features

### 7. Pricing

Pricing should feel downstream from product understanding, not equal to it at first glance.

## State Design

The redesign must explicitly support these states:

### First-Time Visitor

- sees product framing
- chooses workspace
- understands value before seeing paywall

### First-Time Compliance User

- sees wizard immediately
- understands why profile answers matter
- sees useful output quickly

### Returning User

- lands back in last used workspace
- sees immediate next actions

### Free User

- sees useful value in next 30 days and penalty tool
- understands what paid unlocks

### Paid User

- sees full calendar
- can export `.ics`
- sees T5018 when applicable

## Accessibility Requirements

- interactive targets must remain comfortably tappable
- urgency states must not rely on color alone
- tab/workspace state must be explicit
- locked content overlays must remain readable
- labels and helper text must be clear without hover

## Anti-Patterns To Avoid

- hiding Compliance Hub below a dominant hero without stronger emphasis
- mixing benefits, compliance, tax, and pricing equally in one continuous scroll
- relying on subtle pills as primary product navigation
- making pricing the strongest above-the-fold CTA
- overloading hero with too many badges or long explanatory copy
- turning the app into a card wall with no task order
- using blur/lock overlays so aggressively that the UI feels hostile

## Implementation Plan

### Phase 1: Structural Reframe

- update hero copy
- redesign CTAs
- redesign workspace switcher
- rename Overview to Benefits and Planning

### Phase 2: Layout Rework

- separate workspace rendering more clearly
- improve desktop compliance layout
- improve mobile hierarchy and spacing

### Phase 3: Visual Polish

- refine card styles
- improve urgency states
- tune spacing, typography, and section rhythm

### Phase 4: Validation

- test common mobile widths
- test common laptop widths
- check workspace discoverability
- verify that users understand CanStack in under 10 seconds

## File-Level Build Plan

Primary files likely to change:

- [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)
- [components/compliance-dashboard.tsx](/Users/balajik/projects/Canada_Conttractors/components/compliance-dashboard.tsx)
- [components/compliance-wizard.tsx](/Users/balajik/projects/Canada_Conttractors/components/compliance-wizard.tsx)
- [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json)
- [messages/fr.json](/Users/balajik/projects/Canada_Conttractors/messages/fr.json)
- possibly shared UI primitives if spacing/segmented navigation needs a reusable component

## Final Recommendation

Do not rename the product yet.

Keep `CanStack` as the brand, but redesign the UI so the product promise is:

- broader
- more legible
- more operational

The highest-value move is not a new name. It is aligning the interface with the actual product scope.

## Approval Questions

Before build work starts, confirm:

1. Should the hero lead with `Benefits + Compliance`, or `Contractor Operating Hub`?
2. Should `Compliance Hub` become the default active workspace, or remain secondary to Benefits and Planning?
3. Should pricing remain in the header, or move down a level after workspace selection?
