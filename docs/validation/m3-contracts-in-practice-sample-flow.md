# M3 Contracts-in-Practice Validation (Sample End-to-End Flow)

Purpose: start M3 by applying all role contract checklists to one sample feature path and proving the QA bounce-back loop works with evidence.

Reference: `docs/milestones.md` → M3 exit criterion: _"at least 1 end-to-end feature flow passes with bounce-back handling"_.

## Scope Executed (2026-03-02)

Sample feature path used in this run:
- **Feature:** GitHub governance transition enforcement + QA return/fix-window guardrails
- **Primary evidence area:** `packages/oga` policy + execution tests
- **Contracts applied:** UI, Coding, Reviewer, QA, DevOps

---

## Contract Checklist Application

### 1) UI Agent Contract Applied

UI artifact for this backend-heavy flow is a **state/interaction spec** instead of mock screens.

Checklist:
- [x] Design/spec artifact exists for behavior expectations
  - Evidence: `docs/pilots/login-flow.md` stage flow + `docs/governance/transition-gates.md`
- [x] Component behavior notes exist (state transitions + return path)
  - Evidence: `docs/governance/states.md`, `docs/governance/workflow-rules.md`
- [x] Responsive constraints are N/A and explicitly called out
  - Evidence: this run scoped to GitHub issue/PR lifecycle handlers, not UI rendering
- [x] Accessibility baseline is N/A and explicitly called out
  - Evidence: no end-user rendered surface in this sample path

Result: **PASS** (contract satisfied via behavior-spec artifacts for non-visual flow)

### 2) Coding Agent Contract Applied

Checklist:
- [x] Implementation scope mapped to approved behavior inputs
  - Evidence: `packages/oga/src/*` aligned to governance rules and policy contracts
- [x] Tests updated/present for scenario and edge cases
  - Evidence: `packages/oga/test/policyGuards.test.ts`, `packages/oga/test/execution/githubTransitionHandler.test.ts`
- [x] Build passes
  - Evidence command: `npm run check`
- [x] Assumptions/tradeoffs captured
  - Evidence: this artifact sections + existing governance docs references

Result: **PASS**

### 3) Reviewer Worker Contract Applied

Checklist:
- [x] Independent verification target identified (not self-approval pattern)
  - Evidence: PR created for external review (see PR link in summary)
- [x] Correctness/quality/risk review points prepared
  - Evidence: explicit risk notes in this artifact (see "Risk Callouts")
- [x] Approve-or-change-request route defined
  - Evidence: PR body includes Done/Evidence/Needs and review ask

Result: **PASS (pending reviewer decision on PR)**

### 4) QA Agent Contract Applied

Checklist:
- [x] Acceptance criteria verification checklist executed
  - Evidence: tests below + bounce-back simulation log
- [x] UI alignment verified against available artifacts
  - Evidence: governance state/transition docs and pilot flow references
- [x] Edge-case checks executed
  - Evidence: denied transition + idempotency + retry tests in transition handler suite
- [x] Rejection package simulation completed with repro and return evidence
  - Evidence: bounce-back simulation below

Result: **PASS**

### 5) DevOps Agent Contract Applied

Checklist:
- [x] Release criteria checked pre-deploy
  - Evidence: full workspace check `npm run check` passing
- [x] Deployment surrogate for docs+tests run recorded
  - Evidence: branch + PR as promotion artifact for merge/deploy gate
- [x] Post-deploy verification note prepared
  - Evidence: CI/test rerun expected on PR; local pass attached here
- [x] Rollback path explicit
  - Evidence: revert PR/commit on failure (standard git rollback path)

Result: **PASS (pre-merge validation state)**

---

## QA Bounce-Back Simulation (Required M3 Evidence)

### Simulation Goal
Prove that when QA detects missing/invalid gate conditions, flow bounces back with actionable evidence and returns through fix-window constraints.

### Repro + Evidence
Executed command:

```bash
npm --workspace @harambee/oga run test -- --reporter=verbose test/policyGuards.test.ts test/execution/githubTransitionHandler.test.ts
```

Observed evidence from run:
- `test_denied_transition_is_non_mutating_but_auditable` ✅
  - Models QA rejection path when required artifacts are missing.
- `test_canAssignTask_when_worker_in_fix_window_and_strict_window_rejects` ✅
  - Models reserved fix-window priority return (no new assignment while return is unresolved).
- `test_canTransitionStage_execution_to_verification_without_reviewer_rejects` ✅
  - Models stage-gate rejection until reviewer condition is satisfied.
- Full targeted suite result: **14 passed / 14 total**.

### Bounce-Back Interpretation
1. QA rejects transition (`allowed: false`) with non-mutating but auditable output.
2. Task remains in return/fix posture (strict fix-window guard blocks new unrelated assignments).
3. Once required reviewer/artifact conditions are satisfied, transition proceeds.

Outcome: **QA bounce-back loop validated with executable evidence**.

---

## Risk Callouts

- This run uses executable policy/handler tests as the end-to-end evidence path rather than a live GitHub issue mutation run.
- Live GitHub environment validation can be added later as hardening (similar to M1 live samples).

---

## Completion Summary

- Validation date: 2026-03-02
- Scope: M3 kick-off, sample contracts-in-practice flow
- Contracts covered: 5/5 (UI, Coding, Reviewer, QA, DevOps)
- QA bounce-back simulation: complete
- Recommendation: **M3 status moves from Not started → In progress**
