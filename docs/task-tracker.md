# Harambee Task Tracker

_Last updated: 2026-03-02 (added default-branch canonicalization runbook for `main` migration)_

This tracker records what is **done** vs **not done** by milestone and execution track.

## Snapshot by Milestone

| Milestone | Status | Done | Not Done / Remaining |
| --- | --- | --- | --- |
| M0 — Foundation Docs | In review | Architecture/docs baseline exists (`docs/architecture-v1.md`, `docs/milestones.md`, `docs/task-breakdown.md`, `docs/roles-and-contracts.md`, `docs/complexity-rubric.md`) | Explicit "human approval of v1 design baseline" not yet recorded in repo artifacts |
| M1 — Workflow Schema & Governance | Complete | Dry-run issues, discussion workflows, Project v2 automation + live validation, governance-state hardening, and reporting refinement completed with artifacts | Dedicated category creation remains manual UI-only (fallback mapping enforced) |
| M2 — OgaArchitect Dispatch | Complete | Protocol docs + executable simulation evidence completed (worker-ready/request-task, ack timeout requeue, fix-window enforcement, anti-collision proof) | Optional live-fire replay only |
| M3 — Contracts in Practice | Complete | Sample flow + QA bounce-back evidence and live replay artifact completed | None blocking |
| M4 — Optional Redis Coordination | Complete | Protocol + executable failure-mode simulation + telemetry replay artifacts completed | None blocking |
| M5 — Starter Kit | Complete | Starter-kit docs + local and external replay adoption proofs completed | None blocking |

## Track-Level Status (Done vs Not Done)

### Track A — Governance Schema (M1)
- ✅ Done: issue templates, labels, states, transition gates, dry-run evidence.

### Track B — Workflow Operations / Project Wiring
- ✅ Done: Project v2 sync workflow/script/docs + live validation.
- ✅ Optional hardening completed: Governance State field mapping + parseable `sync_report` output.

### Track C — Validation & Exit Evidence (M1 Exit)
- ✅ Done: full issue/discussion validation and usage protocol.
- ⏳ Optional manual item: dedicated discussion categories via UI (API unavailable).

### Track D — Runtime/Execution Readiness
- ✅ Done: runtime harness (M2), policy simulations, Redis failure-mode and telemetry replay artifacts.

## Source of Truth References
- M1 checklist: `docs/validation/m1-dry-run-validation-checklist.md`
- M1 live Project v2 validation: `docs/validation/artifacts/m1-projectv2-live-validation-2026-03-02.txt`
- M1 governance-state hardening: `docs/validation/artifacts/m1-projectv2-governance-state-hardening-2026-03-02.md`
- M1 discussion category fallback/API blocker: `docs/validation/artifacts/m1-discussion-category-hardening-2026-03-02.md`
- M1 reporting refinement: `docs/validation/artifacts/m1-governance-reporting-refinement-2026-03-02.md`
- M2 checklist: `docs/validation/m2-dispatch-simulation-checklist.md`
- M3 checklist + live replay: `docs/validation/m3-contracts-in-practice-sample-flow.md`, `docs/validation/artifacts/m3-live-github-replay-2026-03-02.md`
- M4 checklist + telemetry replay: `docs/validation/m4-redis-failure-simulation-checklist.md`, `docs/validation/artifacts/m4-live-redis-telemetry-replay-2026-03-02.md`
- M5 adoption guide + replay artifact: `docs/starter-kit/adoption-under-1-day.md`, `docs/validation/artifacts/m5-external-adoption-replay-2026-03-02.md`
- Final status artifact: `docs/validation/project-status-2026-03-02.md`
- Default-branch migration runbook: `docs/validation/default-branch-main-migration-runbook.md`
- Current board: `WORKBOARD.md`
