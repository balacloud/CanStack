# Golden Rules

## Product Rules

1. Do not invent external APIs for compliance, CRA, Revenu Quebec, WCB, or insurance quoting.
2. Compliance data must be hardcoded typed constants in dedicated `lib/` files unless the product direction explicitly changes.
3. Tax, penalty, and premium figures shown to users must be framed as estimates with disclaimers.
4. Do not present regulated-adjacent guidance as professional tax, legal, insurance, or investment advice.
5. Quebec tax/remittance treatment must explicitly account for Revenu Quebec where applicable.

## Engineering Rules

1. Understand the current codebase before making structural changes.
2. Do not overwrite existing files broadly when focused edits will do.
3. Prefer deterministic business logic for compliance-sensitive flows.
4. Verify with `npm run lint` and `npm run build` after meaningful changes.
5. Prefer small, well-documented operational scripts over manual repetitive commands.

## UX Rules

1. Optimize for clarity, trust, and operator usefulness over cleverness.
2. Treat CanStack as one product serving multiple operator stages.
3. Avoid unclear blended messaging that makes the product feel like two stitched tools.
4. The interface should feel like premium vertical SaaS, with approachable language.

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
