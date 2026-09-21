# Golden Rules

**Scope note (added 2026-09-21):** CanStack is now the parent/legal umbrella org (see `docs/stable/ROADMAP.md` "Corporate Structure"), and this repo holds one product under it — the contractor compliance/tax SaaS. Rules below govern this product. A separate future product (personal finance/investing education) has its own guardrails in `.claude/skills/finance-navigator.md`; Product Rule 6 and UX Rule 5 below are cross-references, not rules for this repo's own UI.

## Product Rules

1. Do not invent external APIs for compliance, CRA, Revenu Quebec, WCB, or insurance quoting.
2. Compliance data must be hardcoded typed constants in dedicated `lib/` files unless the product direction explicitly changes.
3. Tax, penalty, and premium figures shown to users must be framed as estimates with disclaimers.
4. Do not present regulated-adjacent guidance as professional tax, legal, insurance, or investment advice.
5. Quebec tax/remittance treatment must explicitly account for Revenu Quebec where applicable.
6. The sibling personal finance/investing education product (separate app under the CanStack umbrella, not part of this repo) must be general education only — no ticker-specific or personalized buy/sell recommendations. Naming common instruments (e.g. low-cost index ETFs) for illustration is fine; telling a specific user what to buy is not, and can trigger provincial securities registration requirements independent of app branding. Full guardrails: `.claude/skills/finance-navigator.md`.

## Engineering Rules

1. Understand the current codebase before making structural changes.
2. Do not overwrite existing files broadly when focused edits will do.
3. Prefer deterministic business logic for compliance-sensitive flows.
4. Verify with `npm run lint` and `npm run build` after meaningful changes.
5. Prefer small, well-documented operational scripts over manual repetitive commands.

## UX Rules

1. Optimize for clarity, trust, and operator usefulness over cleverness.
2. Treat this product (the contractor compliance/tax SaaS) as one cohesive experience serving multiple operator stages.
3. Avoid unclear blended messaging that makes the product feel like two stitched tools.
4. The interface should feel like premium vertical SaaS, with approachable language.
5. Do not add personal finance / investing education content into this product's UI — that audience and tone belongs in the separate sibling product under the CanStack umbrella (see Roadmap "Corporate Structure"), not blended into this one.

## Documentation Rules

1. Stable rules belong in `docs/stable/`.
2. Current moving state belongs in a single current-status file, not many daily fragments.
3. Known issues should be current and actionable.
4. Session notes should summarize what changed, not duplicate every doc.

## Decision Audit Protocol

```text
Use the full audit framework in:
- [docs/stable/AUDIT_FRAMEWORK.md](/Users/balajik/projects/Canada_Conttractors/docs/stable/AUDIT_FRAMEWORK.md)
```

Permanent rule:

- Do not perform market studies, product strategy analysis, or architecture recommendations without applying the audit framework.
