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
- Posted live discussion validation samples:
  - Dispatch: <https://github.com/Vindi-Van/harambee/discussions/64>
  - Standup: <https://github.com/Vindi-Van/harambee/discussions/65>
  - Escalation: <https://github.com/Vindi-Van/harambee/discussions/66>
- Marked M1 discussion validation complete in `docs/validation/m1-dry-run-validation-checklist.md`.
- Closed M1 tracker status in `docs/task-tracker.md`.
- Added Project v2 governance automation artifacts:
  - `.github/workflows/projectv2-governance-sync.yml`
  - `scripts/projectv2_sync.sh`
  - `docs/governance/project-v2-automation.md`
- Updated M1 validation/tracker docs to reflect automation wiring + live validation blocker context.
- Started M3 Contracts-in-Practice flow with sample end-to-end evidence:
  - Added `docs/validation/m3-contracts-in-practice-sample-flow.md`
  - Applied UI/Coding/Reviewer/QA/DevOps contract checklists to a single feature path
  - Recorded QA bounce-back simulation evidence using policy/transition handler tests
  - Ran checks: `npm run check` + targeted OGA tests (14/14 passing)
- Synced M3 status updates in `docs/task-tracker.md` (Not started → In progress).

## Active (In Progress)
- Complete live Project v2 validation evidence run (one sample issue through mapped status transitions) after project IDs/options and token scopes are configured.
- Optional M3 hardening: run the same contracts-in-practice scenario against a live GitHub issue/PR path and attach runtime links.

## Next
- Optional hardening: dedicated discussion categories for dispatch/standup/escalation.
- Begin M2 OgaArchitect dispatch simulation (3-task collision-free assignment evidence set).

## Blocked
- Project v2 live validation currently blocked by missing `read:project`/`project` token scope and unset repo variables for project/field/option IDs.
