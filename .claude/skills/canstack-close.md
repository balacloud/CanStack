# CanStack Session Close

Follow the CanStack session close protocol exactly as defined in `docs/stable/SESSION_PROTOCOL.md`.

## Steps

1. Internally resolve these questions before touching any file:
   - What was built or changed this session?
   - What was fixed or broken?
   - Did any API contract, route, or Supabase schema change?
   - Did priorities or product direction change?
   - Was any new permanent rule learned?

2. Update only the documents that changed in substance:

   **Always update:**
   - `docs/status/CURRENT_STATUS.md` — update date, build status, current focus, blockers, and add a "What Was Built" section for this session
   - `docs/issues/KNOWN_ISSUES.md` — move resolved issues to the Resolved section, add any new issues discovered
   - `CANSTACK_SESSION_NOTES.md` — append a new session entry with: what happened, what was built (with commit refs), what was not done, and next session priorities. End with a "Session Close" paragraph.

   **Update if relevant:**
   - `docs/stable/ROADMAP.md` — if Completed, In Progress, or Pending items changed
   - `PROJECT_CONTEXT.md` — if product priorities, audience, or framing changed
   - `docs/stable/GOLDEN_RULES.md` — if a new lasting engineering or product rule was established
   - `docs/stable/API_CONTRACTS.md` — if any route or API shape changed

3. Run `npm run lint` and `npm run build` to confirm build is passing. Record the result in `CURRENT_STATUS.md`.

4. Commit all updated docs in a single commit with message format:
   `docs: session close [date] — [one-line summary of what was accomplished]`

5. Update the Claude memory file at:
   `/Users/balajik/.claude/projects/-Users-balajik-projects-Canada-Conttractors/memory/project_data_sourcing.md`
   — reflect the current state, resolved items, and next session priorities.

6. Output a final close summary to the user:
   - Commits made this session (table with hash + description)
   - What is now true about the product that wasn't before
   - Your action items (manual steps only you can do)
   - Next session priorities (numbered)
