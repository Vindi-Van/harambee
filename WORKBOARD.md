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
- Posted live discussion validation samples:
  - Dispatch: <https://github.com/Vindi-Van/harambee/discussions/64>
  - Standup: <https://github.com/Vindi-Van/harambee/discussions/65>
  - Escalation: <https://github.com/Vindi-Van/harambee/discussions/66>
- Added Project v2 governance automation artifacts:
  - `.github/workflows/projectv2-governance-sync.yml`
  - `scripts/projectv2_sync.sh`
  - `docs/governance/project-v2-automation.md`
- Completed live Project v2 validation evidence run against <https://github.com/users/Vindi-Van/projects/3>:
  - Created/ran sample issue lifecycle: #77 (Intake -> Execution -> Verification -> Done)
  - Validated token scopes + discovered project/field/option IDs
  - Set required repo variables for automation mapping
  - Captured command/output evidence in `docs/validation/artifacts/m1-projectv2-live-validation-2026-03-02.txt`
- Executed M2 OgaArchitect dispatch simulation evidence set:
  - Added test suite: `packages/oga/test/execution/m2DispatchSimulation.test.ts`
  - Added validation artifact: `docs/validation/m2-dispatch-simulation-checklist.md`
  - Verified protocol flows: worker-ready/request-task, assignment ack-timeout requeue, reserved fix window enforcement, 3-task no-collision proof
- Started M3 Contracts-in-Practice flow with sample end-to-end evidence:
  - Added `docs/validation/m3-contracts-in-practice-sample-flow.md`
  - Applied UI/Coding/Reviewer/QA/DevOps contract checklists to a single feature path
  - Recorded QA bounce-back simulation evidence using policy/transition handler tests
  - Ran checks: `npm run check` + targeted OGA tests (14/14 passing)
- Synced tracker state in `docs/task-tracker.md`.
- Completed M4 optional Redis coordination simulation evidence:
  - Added executable simulation suite: `packages/oga/test/execution/m4RedisCoordinationSimulation.test.ts`
  - Captured runnable evidence output artifacts:
    - `docs/validation/artifacts/m4-redis-simulation-vitest-output.txt`
    - `docs/validation/artifacts/m4-full-check-output.txt`
  - Updated validation checklist with run evidence: `docs/validation/m4-redis-failure-simulation-checklist.md`
  - Verified scenarios: lease exclusivity, stale-worker reclaim/reassignment, fix-window reclaim deferral, retry-cap escalation to blocker
  - Ran full checks: `npm run check` (all workspaces passing)

## Active (In Progress)
- Optional M3 hardening: run the same contracts-in-practice scenario against a live GitHub issue/PR path and attach runtime links.

## Next
- Optional Project v2 hardening: expand Status options from 3-state (`Todo/In progress/Done`) to full governance-state options and remap repo variables accordingly.
- Optional M4 hardening: run same reclaim scenarios against live Redis + runtime telemetry sink and attach artifacts.
- Optional hardening: dedicated discussion categories for dispatch/standup/escalation.

## Blocked
- None.
