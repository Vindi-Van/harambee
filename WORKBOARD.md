# WORKBOARD

## Now (Completed)
- Executed M1 real dry-run lifecycle samples for each required issue template:
  - Task: #58
  - Bug: #59
  - Design request: #60
  - Blocker: #61
- All four dry-run issues were progressed through lifecycle labels and closed with evidence notes.
- Updated validation artifact:
  - `docs/validation/m1-dry-run-validation-checklist.md`
- Added discussion-template package:
  - `.github/DISCUSSION_TEMPLATE/config.yml`
  - `.github/DISCUSSION_TEMPLATE/dispatch.yml`
  - `.github/DISCUSSION_TEMPLATE/standup.yml`
  - `.github/DISCUSSION_TEMPLATE/escalation.yml`
- Added discussion usage/fallback protocol:
  - `docs/protocols/discussion-template-usage.md`
- Synced tracker state in `docs/task-tracker.md`.

## Active (In Progress)
- M1 closeout decision is now **conditional**:
  - Issue-template dry-run criterion is satisfied.
  - Discussion live-post validation is blocked because GitHub Discussions is disabled in repo settings (`has_discussions=false`).

## Next
- Maintainer action: enable GitHub Discussions and create/verify categories.
- Run one live sample discussion post per template (dispatch/standup/escalation).
- Capture those links in `docs/validation/m1-dry-run-validation-checklist.md` to finalize M1 close.
- Begin M2 dispatch protocol simulation.

## Blocked
- Live discussion-template validation is blocked pending repo Discussions enablement.
