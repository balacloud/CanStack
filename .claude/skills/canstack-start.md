# CanStack Session Start

Run the CanStack session startup protocol as a short mission briefing. Keep the process rigorous, but make the output feel like a lightweight game loop that gives the user a clear start state, objective, hazards, and next move.

Follow `docs/stable/SESSION_PROTOCOL.md` exactly. Do not start the dev server unless the user separately asks for that.

## Startup Checks

1. Read these files in order:
   - `PROJECT_CONTEXT.md`
   - `docs/stable/GOLDEN_RULES.md`
   - `docs/stable/AUDIT_FRAMEWORK.md`
   - `docs/stable/ROADMAP.md`
   - `docs/status/CURRENT_STATUS.md`
   - `docs/issues/KNOWN_ISSUES.md`

2. Check git status for uncommitted changes from the previous session.

3. Determine:
   - whether the previous session closed cleanly
   - current build/runtime/product state
   - the single best next objective
   - open blockers or risks
   - whether the audit framework applies to the next likely task

## Game Layer

Assign the session a simple readiness score out of 100:

- Start at 100.
- Subtract 20 for uncommitted changes.
- Subtract 15 for failing or unknown lint/build status.
- Subtract 15 for unresolved launch-blocking issues.
- Subtract 10 for external/manual blockers.
- Subtract 10 for stale current-status documentation.
- Do not invent certainty. If a signal is unknown, label it unknown and apply the relevant deduction.

Use these score labels:

- `90-100`: Ready
- `70-89`: Playable with hazards
- `50-69`: Setup needed
- `<50`: Blocked start

## Output Format

Return exactly these sections:

1. **Session Card**
   - Date
   - Readiness score and label
   - Previous session closure status
   - Git status

2. **Main Quest**
   - One sentence naming the highest-leverage objective for this session.
   - Make it specific enough that work can begin immediately.

3. **Side Quests**
   - Up to three useful secondary tasks.
   - Each must be actionable and grounded in the startup docs.

4. **Hazards**
   - Open blockers, risks, stale data, or unresolved validation gaps.
   - Include `None detected` only if the docs and git status support that.

5. **Power-Ups**
   - Existing assets, scripts, docs, or prior work that make today easier.
   - Keep this practical, not motivational.

6. **Audit Gate**
   - Say `Applies` or `Does not apply`.
   - Give the reason in one sentence.

7. **Start Line**
   - One direct question asking what the user wants to do first, unless the main quest is already explicitly requested.

Do not ask the user what they want to work on until the full mission briefing is complete.
