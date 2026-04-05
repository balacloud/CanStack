# Phase 1 Homepage Evaluation

Last updated: March 16, 2026

## Scope

This evaluation reviews the current homepage and top-level product shell for CanStack using:

- [docs/stable/AUDIT_FRAMEWORK.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/AUDIT_FRAMEWORK.md)
- [UX_EVALUATION_TEMPLATE.md](/Users/balajik/projects/Canada_Conttractors/UX_EVALUATION_TEMPLATE.md)
- [docs/decisions/PHASE_1_MARKET_STUDY.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PHASE_1_MARKET_STUDY.md)
- current implementation in [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)
- current copy in [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json)

## Scoring Note

> **Claim:** "The UX scorecard is out of 40."
> **Reasoning:** The template has 8 sections, each scored out of 8. That sums to 64, not 40.
> **Verdict:** [MISLEADING — CORRECTION: The current rubric structure totals 64 points. The `__/40` line in the template is internally inconsistent and should not be treated as mathematically correct.]

For this evaluation, I score the page out of 64 and interpret the result qualitatively.

## Section Scores

### 1. First Impression

Score: `6/8`

> **Claim:** "A new visitor can tell who the product is for within 10 seconds."
> **Reasoning:** The hero uses `Self-employed Canada`, `Self-employed operator platform`, and `Run your contractor business with more confidence.` Those signals are materially clearer than a generic benefits-only frame. However, the copy still mixes `self-employed Canadians`, `contractor business`, and `operators`, which introduces some role ambiguity.
> **Verdict:** [PLAUSIBLE — REASON: The audience is substantially clearer than before, but whether users consistently identify the intended audience in under 10 seconds still needs user testing.]

> **Claim:** "A new visitor can tell what the product does within 10 seconds."
> **Reasoning:** The subtitle explicitly mentions benefits, taxes, payroll, sales tax, and provincial compliance deadlines. That is specific and concrete. The risk is breadth: the page communicates several jobs at once rather than one dominant job.
> **Verdict:** [PLAUSIBLE — REASON: The functionality is visible, but the breadth may reduce speed of comprehension. A 5-second or 10-second comprehension test would confirm this.]

> **Claim:** "The page feels like a serious product."
> **Reasoning:** The UI uses structured cards, restrained color, strong type hierarchy, trust cues, and explicit workspaces. This is aligned with adjacent SaaS patterns seen in the market study.
> **Verdict:** [VERIFIED — SOURCE: [docs/decisions/PHASE_1_MARKET_STUDY.md](/Users/balajik/projects/Canada_Conttractors/docs/decisions/PHASE_1_MARKET_STUDY.md), [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)]

> **Claim:** "The hero communicates outcomes, not just categories."
> **Reasoning:** `Run your contractor business with more confidence` is an outcome. The subtitle then drops into categories and tasks. This is directionally right.
> **Verdict:** [VERIFIED — SOURCE: [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json)]

### 2. Audience Clarity

Score: `5/8`

> **Claim:** "The primary audience is obvious."
> **Reasoning:** The homepage strongly signals self-employed operators, but `contractor`, `self-employed Canadians`, and `operators` are not perfectly identical groups. The likely audience is inferable, but not yet maximally crisp.
> **Verdict:** [PLAUSIBLE — REASON: The targeting is directionally good, but stronger single-role wording like `self-employed business owners` or `one-person businesses` may test better. User feedback is needed.]

> **Claim:** "The product does not feel like it is trying to serve everyone equally."
> **Reasoning:** The messaging is now narrower than before. It is clearly not for generic consumers or large enterprises. Still, it spans freelancers, incorporated consultants, payroll operators, and compliance-heavy users.
> **Verdict:** [PLAUSIBLE — REASON: The audience is bounded, but still somewhat broad inside the self-employed bucket.]

> **Claim:** "The copy distinguishes early-stage users from operational users."
> **Reasoning:** The workspace section explicitly says planning is for setup and compliance is for recurring obligations.
> **Verdict:** [VERIFIED — SOURCE: [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)]

> **Claim:** "The site feels coherent across both groups."
> **Reasoning:** The stage-based framing does create coherence, especially when compared to earlier versions. This aligns with the lifecycle lesson drawn from Gusto in the market study.
> **Verdict:** [PLAUSIBLE — REASON: The structure is coherent in theory, but real users still need to confirm whether the split feels natural.]

### 3. Navigation

Score: `6/8`

> **Claim:** "The best first action is obvious."
> **Reasoning:** The primary CTA currently opens `Deadlines & Compliance`, while the secondary CTA starts planning. This implies compliance-first, even though the page messaging also says planning is for users setting up. That creates a strategic tension.
> **Verdict:** [MISLEADING — CORRECTION: The interface makes a first action available, but the *best* first action is not yet validated. The current CTA priority may be premature without user evidence.]

> **Claim:** "`Start & Plan` is understandable without explanation."
> **Reasoning:** The label is concise and the supporting body clarifies it.
> **Verdict:** [VERIFIED — SOURCE: [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json)]

> **Claim:** "`Deadlines & Compliance` is understandable without explanation."
> **Reasoning:** The label is specific and the body text makes the meaning clearer.
> **Verdict:** [VERIFIED — SOURCE: [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json)]

> **Claim:** "The workspace selector is visible enough above the fold."
> **Reasoning:** It appears both in the dark summary card and again in the dedicated workspace section. This is strong from a discoverability standpoint.
> **Verdict:** [VERIFIED — SOURCE: [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)]

### 4. Product Coherence

Score: `7/8`

> **Claim:** "The site feels like one product with stages, not two stitched products."
> **Reasoning:** The hero, snapshot, and workspace copy all reinforce one operator journey spanning planning and deadlines.
> **Verdict:** [VERIFIED — SOURCE: [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx), [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json)]

> **Claim:** "Benefits/planning and compliance feel connected by a shared user journey."
> **Reasoning:** The page explicitly connects setup with recurring obligations and uses a shared operator lens.
> **Verdict:** [VERIFIED — SOURCE: [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)]

> **Claim:** "The homepage does not over-emphasize one module in a confusing way."
> **Reasoning:** It is materially more balanced than earlier versions. The one caveat is that the primary CTA emphasizes compliance first.
> **Verdict:** [PLAUSIBLE — REASON: The page is mostly balanced, but CTA hierarchy may still be nudging users toward one module before validation.]

> **Claim:** "The right-side summary supports the main message."
> **Reasoning:** The operator snapshot shows tax, RRSP room, and workspace choices, which reinforces the planning-to-operations theme.
> **Verdict:** [VERIFIED — SOURCE: [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)]

### 5. Trust and Professionalism

Score: `7/8`

> **Claim:** "The UI feels credible for tax/compliance-adjacent tasks."
> **Reasoning:** The page uses direct trust cues like `No fake compliance APIs` and `Local rule-based calculations`, and the visual system is calm rather than flashy.
> **Verdict:** [VERIFIED — SOURCE: [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json)]

> **Claim:** "The design looks polished enough for a paid SaaS product."
> **Reasoning:** The current shell has premium card treatment, spacing discipline, and a consistent layout hierarchy.
> **Verdict:** [PLAUSIBLE — REASON: It appears strong enough visually, but real paid-conversion readiness also depends on onboarding, pricing clarity, and trust content not fully assessed by the hero alone.]

> **Claim:** "Trust cues feel specific, not generic."
> **Reasoning:** The trust cues mention fake APIs, rule-based calculations, and operator fit. Those are product-specific.
> **Verdict:** [VERIFIED — SOURCE: [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json)]

> **Claim:** "The page feels calm and reliable."
> **Reasoning:** The color palette and layout are restrained. The page does not lean on hype or novelty effects.
> **Verdict:** [VERIFIED — SOURCE: [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)]

### 6. Benefits / Planning Workspace

Score: `6/8`

> **Claim:** "The planning workspace feels useful for self-employed users."
> **Reasoning:** The overview includes quiz, live financial snapshot, recommendations, provider resources, tax estimate, RRSP room, and pricing. That is a coherent self-employed planning bundle.
> **Verdict:** [VERIFIED — SOURCE: [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)]

> **Claim:** "The recommendation flow is understandable."
> **Reasoning:** The recommendation section is structurally clear, but the usefulness of the recommendations themselves is a separate product-quality question not fully answered by the shell alone.
> **Verdict:** [PLAUSIBLE — REASON: The UI structure is understandable, but recommendation trust and perceived value need user testing.]

> **Claim:** "Tax / RRSP tools feel integrated into a coherent workflow."
> **Reasoning:** They are surfaced in the same overview snapshot and workspace, not as isolated calculators.
> **Verdict:** [VERIFIED — SOURCE: [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)]

> **Claim:** "The section feels like a workspace, not a random tool collection."
> **Reasoning:** It is more coherent than a generic tools page, though the numbered sections still read somewhat like a guided stack of modules.
> **Verdict:** [PLAUSIBLE — REASON: It is mostly cohesive, but there is still some feature-list feel in the numbered content progression.]

### 7. Compliance Hub

Score: `6/8`

> **Claim:** "The Compliance Hub value is immediately obvious."
> **Reasoning:** The CTA, labels, and copy do a good job of signaling deadlines, remittances, payroll, and obligations.
> **Verdict:** [VERIFIED — SOURCE: [messages/en.json](/Users/balajik/projects/Canada_Conttractors/messages/en.json), [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)]

> **Claim:** "The wizard feels fast and intuitive."
> **Reasoning:** This cannot be fully confirmed from the homepage shell. It requires interaction testing.
> **Verdict:** [UNVERIFIED — NEEDS: Direct use testing on mobile and desktop, plus completion/drop-off observation.]

> **Claim:** "The dashboard clearly shows what matters next."
> **Reasoning:** Based on the implemented deadline and next-30-days model, the design is directionally aligned with that goal, but the claim still requires interaction review on the actual dashboard state.
> **Verdict:** [PLAUSIBLE — REASON: The current implementation is consistent with the goal, but it still needs observational validation.]

> **Claim:** "The paywall/gating feels reasonable."
> **Reasoning:** Free next-30-days and free penalty forecaster are sensible, but the perceived reasonableness of the gate cannot be assumed without testing.
> **Verdict:** [UNVERIFIED — NEEDS: User reactions to the full-calendar lock and upgrade CTA.]

### 8. Mobile UX

Score: `6/8`

> **Claim:** "The mobile first screen still makes sense."
> **Reasoning:** The current hero stack, badges, trust row, CTA pair, and workspace switch are all mobile-adaptive in code. However, visual scan quality on an actual handset still needs live validation.
> **Verdict:** [PLAUSIBLE — REASON: The layout is coded responsively and likely workable, but real-device review is still needed.]

> **Claim:** "Tap targets feel comfortable."
> **Reasoning:** The primary buttons use `min-h-12`, and the workspace buttons are visually substantial.
> **Verdict:** [VERIFIED — SOURCE: [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)]

> **Claim:** "The layout does not become visually overwhelming."
> **Reasoning:** The top shell is well-spaced, but the combined amount of hero, badges, trust cues, CTA, snapshot, and workspace selection may still be cognitively dense on smaller devices.
> **Verdict:** [PLAUSIBLE — REASON: The structure is controlled, but actual mobile scanning behavior needs review.]

> **Claim:** "Important actions are still easy to find."
> **Reasoning:** Both CTAs and the workspace switch are placed high on the page.
> **Verdict:** [VERIFIED — SOURCE: [components/canstack-app.tsx](/Users/balajik/projects/Canada_Conttractors/components/canstack-app.tsx)]

## Total Score

Total: `49/64`

> **Claim:** "This score means the direction is strong."
> **Reasoning:** The score is above the midpoint and reflects a materially improved product shell. However, the rubric thresholds were written for a different total, so this number should be interpreted qualitatively, not mechanically.
> **Verdict:** [MISLEADING — CORRECTION: The score indicates the current direction is workable and substantially improved, but not yet fully validated. It should not be treated as a precise benchmark.]

## Decision Summary

### Primary audience

Self-employed Canadian business operators managing their own planning, taxes, and recurring admin obligations.

### Secondary audience

Established contractor-business operators with payroll, GST/HST, subcontractor, or provincial compliance responsibilities.

### Primary job-to-be-done

Help self-employed Canadians understand what to set up and stay ahead of recurring business deadlines without a back office.

### Best first click

Unverified between `Start & Plan` and a stage selector.

## Top 3 Problems

1. The audience is clearer, but still not maximally crisp because `contractor`, `self-employed`, and `operator` are mixed.
2. The primary CTA favors `Deadlines & Compliance` before the product has validated whether compliance should be the first journey.
3. The scorecard and validation process still rely too much on internal review and need real observation or lightweight user testing.

## Top 3 Next Changes

1. Run a 5-second comprehension test and first-click test with at least a few real users.
2. Decide whether the homepage should lead with `Start & Plan` or a stage selector instead of sending users straight into compliance first.
3. Tighten audience language so one primary identity is used consistently across hero, trust cues, and workspace descriptions.

## Final Phase 1 Conclusion

> **Claim:** "The homepage is ready for deeper workflow work."
> **Reasoning:** The homepage is no longer fundamentally confused. It now presents one SaaS product with clearer stages, stronger trust cues, and a more credible operator frame. The remaining issues are prioritization and validation, not a broken concept.
> **Verdict:** [PLAUSIBLE — REASON: The direction appears solid enough to continue, but it still needs user validation before treating the messaging and CTA hierarchy as settled.]
