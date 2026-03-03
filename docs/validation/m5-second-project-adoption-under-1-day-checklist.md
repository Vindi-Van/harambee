# M5 Validation Checklist — Second Project Adoption in <1 Day (Simulation Scaffold)

Date: 2026-03-02
Status: Scaffolded (ready for live run)
Owner: Matrim Cauthon

## Goal
Provide a repeatable, auditable checklist and evidence scaffold proving a **second repository** can adopt Harambee in under one working day (<8h).

## Scope
- This document is a simulation checklist/evidence scaffold.
- It does **not** claim a completed live second-repo adoption yet.
- It defines exactly what to collect during the next live run.

## Candidate Second Repository (fill before run)
- Repo URL:
- Visibility:
- Default branch:
- Operators:

## <1 Day Adoption Runbook Checklist

### Phase 0 — Preconditions (T-0:15 to T+0:00)
- [ ] Confirm maintainer/admin access to target repo.
- [ ] Confirm GitHub Discussions can be enabled.
- [ ] Confirm Project v2 access + token scopes (`project`, `repo`, `workflow`).
- [ ] Confirm local prerequisites: `gh`, `node`, `npm`.

### Phase 1 — Starter Kit Bootstrap (T+0:00 to T+0:45)
- [ ] Copy baseline files from `docs/starter-kit/reusable-template.md`.
- [ ] Enable Discussions.
- [ ] Add/enable `.github/workflows/projectv2-governance-sync.yml`.
- [ ] Commit + push bootstrap set.

Evidence to capture:
- Commit URL(s):
- Workflow file diff URL:
- Repo settings screenshot/log notes:

### Phase 2 — Governance Wiring (T+0:45 to T+2:00)
- [ ] Create governance labels (`docs/governance/labels.md`).
- [ ] Attach Project v2 board.
- [ ] Set required repo variables for `scripts/projectv2_sync.sh`.
- [ ] Trigger no-op workflow validation.

Evidence to capture:
- Project URL:
- Variables set list:
- Workflow run URL:

### Phase 3 — Lifecycle Dry-Run (T+2:00 to T+4:00)
- [ ] Open one `task.yml` issue.
- [ ] Move issue through governance states (Intake -> Execution -> Verification -> Done).
- [ ] Verify labels + board sync are correct.

Evidence to capture:
- Issue URL:
- Timeline transitions:
- Board card state screenshots/log snippets:

### Phase 4 — Discussion Protocol Proof (T+4:00 to T+6:00)
- [ ] Open one Dispatch discussion.
- [ ] Open one Standup discussion.
- [ ] Test fallback procedure from `docs/protocols/discussion-template-usage.md`.
- [ ] Record response latency + handoff notes.

Evidence to capture:
- Dispatch discussion URL:
- Standup discussion URL:
- Fallback test notes:

### Phase 5 — Exit Gate & Bundle (T+6:00 to T+8:00)
- [ ] Run `npm run check` (or equivalent repo checks).
- [ ] Collect all links + logs in one artifact file.
- [ ] Mark outcome:
  - [ ] PASS (adopted <1 day)
  - [ ] NEEDS FIXES

Evidence to capture:
- Check command output snippet:
- Final decision + rationale:
- Follow-up actions:

## Acceptance Criteria (M5)
M5 can be closed when one dated second-repo run includes:
1. Lifecycle issue evidence,
2. Discussion evidence,
3. Project/workflow sync evidence,
4. Check output evidence,
5. Elapsed time under 8h.

## Linked Artifact Template
- `docs/validation/artifacts/m5-second-project-adoption-simulation-2026-03-02.md`
- `docs/validation/default-branch-main-migration-runbook.md` (use when canonicalizing `master` -> `main`)
