# CanStack Session Start

Follow the CanStack session startup protocol exactly as defined in `docs/stable/SESSION_PROTOCOL.md`.

## Steps

1. Read these 5 files in order:
   - `PROJECT_CONTEXT.md`
   - `docs/stable/GOLDEN_RULES.md`
   - `docs/stable/ROADMAP.md`
   - `docs/status/CURRENT_STATUS.md`
   - `docs/issues/KNOWN_ISSUES.md`

2. Check git status for any uncommitted changes left from the previous session. If any exist, flag them clearly.

3. Output a startup summary with exactly these four sections:
   - **Previous session closure** — was it clean? Any uncommitted changes?
   - **Current product state** — build status, what is live, what is activated
   - **Top priority** — the single most important thing to work on next
   - **Open blockers** — anything that requires manual action or is blocked on external input
   - **Audit framework applies?** — yes or no, and why

Do not ask the user what they want to work on until the startup summary is complete.
