# Session Protocol

## Session Start

Read these files in this order before planning or coding:

1. [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md)
2. [docs/stable/GOLDEN_RULES.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/GOLDEN_RULES.md)
3. [docs/stable/AUDIT_FRAMEWORK.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/AUDIT_FRAMEWORK.md) for any research, strategy, market, product, UX, or architecture task
4. [docs/stable/ROADMAP.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/ROADMAP.md)
5. [docs/status/CURRENT_STATUS.md](/Users/balajik/projects/Canada_Conttractors/docs/status/CURRENT_STATUS.md)
6. [docs/issues/KNOWN_ISSUES.md](/Users/balajik/projects/Canada_Conttractors/docs/issues/KNOWN_ISSUES.md)
7. [docs/stable/API_CONTRACTS.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/API_CONTRACTS.md) only if the task touches routes or API behavior
8. [UI_REDESIGN_SPEC.md](/Users/balajik/projects/Canada_Conttractors/UI_REDESIGN_SPEC.md) only if the task touches UX, IA, messaging, or visual design
9. [UX_EVALUATION_TEMPLATE.md](/Users/balajik/projects/Canada_Conttractors/UX_EVALUATION_TEMPLATE.md) only if the task is product/UX evaluation

### Required Startup Summary

After reading the startup docs, state:

- current product state
- current top priority
- blockers or open risks
- whether the audit framework applies to the task

Then continue with the user’s request.

### Startup Behavior Rules

- Do not ask the user to restate the project unless a real contradiction exists.
- Do not jump straight into fixing without understanding the current state.
- Do not load every document blindly if only a subset is relevant, but always start with the first five.
- For research, market analysis, or strategic recommendations, explicitly apply the audit framework.

## Session Close

At the end of a meaningful session, update only the documents that actually changed in substance.

### Always Consider Updating

- [docs/status/CURRENT_STATUS.md](/Users/balajik/projects/Canada_Conttractors/docs/status/CURRENT_STATUS.md)
- [docs/issues/KNOWN_ISSUES.md](/Users/balajik/projects/Canada_Conttractors/docs/issues/KNOWN_ISSUES.md)
- [CANSTACK_SESSION_NOTES.md](/Users/balajik/projects/Canada_Conttractors/CANSTACK_SESSION_NOTES.md)

### Update If Relevant

- [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md) if priorities, audience, or product framing changed
- [docs/stable/ROADMAP.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/ROADMAP.md) if phase status or next steps changed
- [docs/stable/API_CONTRACTS.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/API_CONTRACTS.md) if any route or contract changed
- [docs/stable/GOLDEN_RULES.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/GOLDEN_RULES.md) if a new lasting rule was learned
- [README.md](/Users/balajik/projects/Canada_Conttractors/README.md) if setup, architecture, or operating workflow changed
- [UI_REDESIGN_SPEC.md](/Users/balajik/projects/Canada_Conttractors/UI_REDESIGN_SPEC.md) if the approved design direction changed

### Close Questions To Resolve Internally

Before closing, determine:

- what changed
- what broke or was fixed
- whether any contract changed
- whether priorities changed
- whether any new permanent rule was learned

## First File Rule

The first file to load is always:

- [PROJECT_CONTEXT.md](/Users/balajik/projects/Canada_Conttractors/PROJECT_CONTEXT.md)

Reason:

- it tells the current product identity
- it anchors the current audience and priorities
- it prevents reading stable rules without knowing current context
