# Harambee Task Tracker

_Last updated: 2026-03-02 (post-merge PR #56)_

This tracker records what is **done** vs **not done** by milestone and execution track.

## Snapshot by Milestone

| Milestone | Status | Done | Not Done / Remaining |
| --- | --- | --- | --- |
| M0 — Foundation Docs | In review | Architecture/docs baseline exists (`docs/architecture-v1.md`, `docs/milestones.md`, `docs/task-breakdown.md`, `docs/roles-and-contracts.md`, `docs/complexity-rubric.md`) | Explicit "human approval of v1 design baseline" not yet recorded in repo artifacts |
| M1 — Workflow Schema & Governance | In progress (near exit) | PR #56 merged; governance docs + templates landed (`task`, `bug`, `design request`, `blocker`), state model, labels, transition gate matrix | M1 exit dry-run evidence package (one sample issue per template type) not yet attached as artifact; discussion template gap remains (dispatch/standup/escalation templates absent) |
| M2 — OgaArchitect Dispatch | Not started | Protocol docs exist (`docs/protocols/assignment-flow.md`) | Simulated assignment run evidence for 3 tasks without collision not yet produced |
| M3 — Contracts in Practice | Not started | Test matrix seeds exist in docs/testing | End-to-end feature flow with QA bounce-back evidence not yet produced |
| M4 — Optional Redis Coordination | Not started | None required yet | Failure simulation + safe reassignment evidence not yet produced |
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
- ⏳ Not done
  - Dry-run validation artifacts confirming real usage per template type.

### Track B — Workflow Operations / Project Wiring
- ✅ Done
  - Repo-level governance state/label definitions documented.
- ⏳ Not done
  - GitHub Project v2 automation bindings + enforcement evidence not yet captured in repo.

### Track C — Validation & Exit Evidence (M1 Exit)
- ✅ Done
  - M1 exit criterion defined in `docs/milestones.md`.
- ⏳ Not done
  - Single dry-run package proving one sample issue lifecycle per template type.
  - Discussion template gap documented and actioned.

### Track D — Runtime/Execution Readiness
- ✅ Done
  - Runtime harness evidence path merged (Issue #52 now closed).
- ⏳ Not done
  - M2 assignment simulation evidence and anti-collision proof set.

## Source of Truth References
- PR #56 (merged): <https://github.com/Vindi-Van/harambee/pull/56>
- Issue #52 (closed): <https://github.com/Vindi-Van/harambee/issues/52>
- Milestones: `docs/milestones.md`
- Current board: `WORKBOARD.md`
