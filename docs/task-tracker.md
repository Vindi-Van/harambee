# Harambee Task Tracker

_Last updated: 2026-03-02 (M2 validated; M3 sample flow added; M4 Redis coordination planning started)_

This tracker records what is **done** vs **not done** by milestone and execution track.

## Snapshot by Milestone

| Milestone | Status | Done | Not Done / Remaining |
| --- | --- | --- | --- |
| M0 — Foundation Docs | In review | Architecture/docs baseline exists (`docs/architecture-v1.md`, `docs/milestones.md`, `docs/task-breakdown.md`, `docs/roles-and-contracts.md`, `docs/complexity-rubric.md`) | Explicit "human approval of v1 design baseline" not yet recorded in repo artifacts |
| M1 — Workflow Schema & Governance | In progress | Real dry-run executed: one sample issue each for task/bug/design/blocker (#58-#61), lifecycle transitions captured, validation checklist updated, discussion templates + usage protocol added, repo Discussions enabled (`has_discussions=true`, GraphQL `hasDiscussionsEnabled=true`), live sample discussions posted for dispatch/standup/escalation (#64-#66), and Project v2 automation workflow/script/docs added | Live project validation still blocked until project IDs/options are configured and a token with `read:project`/`project` scopes is available |
| M2 — OgaArchitect Dispatch | Complete | Protocol docs + executable simulation evidence completed (`docs/protocols/assignment-flow.md`, `docs/validation/m2-dispatch-simulation-checklist.md`, `packages/oga/test/execution/m2DispatchSimulation.test.ts`) covering worker-ready/request-task, ack timeout requeue, reserved fix window enforcement, and 3-task anti-collision proof | Optional hardening: extend from policy-level simulation to GitHub issue/discussion live-fire replay artifacts |
| M3 — Contracts in Practice | In progress | Sample end-to-end contracts flow executed with QA bounce-back simulation evidence (`docs/validation/m3-contracts-in-practice-sample-flow.md`) | Live GitHub runtime replay of the same M3 path still pending as optional hardening evidence |
| M4 — Optional Redis Coordination | In progress | Redis coordination protocol draft + failure simulation checklist added (`docs/protocols/redis-coordination.md`, `docs/validation/m4-redis-failure-simulation-checklist.md`) | Executable failure simulation run (lease exclusivity, reclaim, retry-cap escalation) not yet produced |
| M5 — Starter Kit | Not started | None required yet | Reusable template + adoption proof (<1 day) not yet produced |

## Track-Level Status (Done vs Not Done)

### Track A — Governance Schema (M1)
- ✅ Done
  - `.github/ISSUE_TEMPLATE/task.yml`
  - `.github/ISSUE_TEMPLATE/bug.yml`
  - `.github/ISSUE_TEMPLATE/design-request.yml`
  - `.github/ISSUE_TEMPLATE/blocker.yml`
  - `docs/governance/labels.md`
  - `docs/governance/states.md`
  - `docs/governance/transition-gates.md`
  - Governance labels provisioned in repo for dry-run execution
- ⏳ Not done
  - None blocking within issue-template scope

### Track B — Workflow Operations / Project Wiring
- ✅ Done
  - Repo-level governance state/label definitions documented.
  - Automation implementation added:
    - `.github/workflows/projectv2-governance-sync.yml`
    - `scripts/projectv2_sync.sh`
    - `docs/governance/project-v2-automation.md`
- ⏳ Not done
  - Live enforcement evidence for at least one issue transition in Project v2 (blocked pending project scope/token + option ID config).

### Track C — Validation & Exit Evidence (M1 Exit)
- ✅ Done
  - M1 exit criterion defined in `docs/milestones.md`.
  - Dry-run evidence package completed in `docs/validation/m1-dry-run-validation-checklist.md` with real issue links (#58-#61).
  - Discussion template files added: `.github/DISCUSSION_TEMPLATE/{dispatch,standup,escalation,config}.yml`.
  - Usage/fallback protocol added: `docs/protocols/discussion-template-usage.md`.
- ⏳ Not done
  - Optional hardening: create dedicated discussion categories for dispatch/standup/escalation (current M1 mapping uses default categories).

### Track D — Runtime/Execution Readiness
- ✅ Done
  - Runtime harness evidence path merged (Issue #52 closed).
  - M2 assignment simulation evidence + anti-collision proof set completed in `docs/validation/m2-dispatch-simulation-checklist.md` and `packages/oga/test/execution/m2DispatchSimulation.test.ts`.
- ⏳ Not done
  - Optional live-fire GitHub replay evidence (beyond policy guard simulation).
  - M3 live GitHub replay evidence (optional hardening beyond current executable test-backed sample flow).

## Source of Truth References
- M1 dry-run issues: <https://github.com/Vindi-Van/harambee/issues/58>, <https://github.com/Vindi-Van/harambee/issues/59>, <https://github.com/Vindi-Van/harambee/issues/60>, <https://github.com/Vindi-Van/harambee/issues/61>
- M1 live discussion samples: <https://github.com/Vindi-Van/harambee/discussions/64>, <https://github.com/Vindi-Van/harambee/discussions/65>, <https://github.com/Vindi-Van/harambee/discussions/66>
- Validation checklist (M1): `docs/validation/m1-dry-run-validation-checklist.md`
- Validation checklist (M2): `docs/validation/m2-dispatch-simulation-checklist.md`
- Validation checklist (M3 sample flow): `docs/validation/m3-contracts-in-practice-sample-flow.md`
- Discussion usage protocol: `docs/protocols/discussion-template-usage.md`
- Milestones: `docs/milestones.md`
- Current board: `WORKBOARD.md`
