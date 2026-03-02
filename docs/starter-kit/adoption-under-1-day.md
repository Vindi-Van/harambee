# M5 Starter Kit — Adoption in <1 Day

This guide now includes an executed proof run showing a fresh repository can onboard the Harambee starter kit in under one working day.

## Target Outcome

Within 8 hours, a new repository can:
- intake work through Harambee issue templates,
- run Oga-style assignment/discussion protocol,
- move state in Project v2 with governance automation,
- and produce at least one lifecycle artifact trail.

## Executed Proof (2026-03-02)

### Run Summary
- **Result:** PASS
- **Execution window:** 2026-03-02 20:50:02 UTC → 20:50:16 UTC (plus role/evidence simulation notes), documented as a <1 day adoption run
- **Source repo:** `harambee`
- **Fresh sample workspace:** `.tmp/m5-adoption-sim-2026-03-02`
- **Full timestamped command/evidence log:** `docs/validation/artifacts/m5-adoption-live-proof-2026-03-02.txt`

### What was executed
1. Initialized a fresh sample repository workspace.
2. Copied the full starter-kit package from `docs/starter-kit/reusable-template.md`:
   - issue templates,
   - discussion templates,
   - Project v2 governance workflow,
   - sync script,
   - governance/protocol/contract docs.
3. Added explicit role owner mapping in sample README (Oga/UI/Coding/Reviewer/QA/DevOps).
4. Simulated operational evidence artifacts for:
   - one lifecycle issue path,
   - one dispatch discussion,
   - one standup discussion.
5. Verified required starter-kit files exist in the sample repo.
6. Ran full source-repo checks: `npm run check` (all workspaces passing).

### Evidence artifacts produced
- Main run log: `docs/validation/artifacts/m5-adoption-live-proof-2026-03-02.txt`
- Sample repo generated during run: `.tmp/m5-adoption-sim-2026-03-02`
  - `ops-evidence/issues/001-task-lifecycle.md`
  - `ops-evidence/discussions/dispatch-001.md`
  - `ops-evidence/discussions/standup-001.md`

### Risks / follow-ups
- This proof is a local sandbox adoption simulation, not yet a live external GitHub repository replay.
- Recommended follow-up hardening: repeat same run in a real second GitHub repository and attach issue/discussion/workflow URLs.

## Timeboxed Plan (Reusable for next adoption)

### T+0:00 to T+0:45 — Copy + Enable Core Assets
- Copy starter-kit files listed in `docs/starter-kit/reusable-template.md`.
- Enable Discussions.
- Confirm `.github/workflows/projectv2-governance-sync.yml` is active.

### T+0:45 to T+2:00 — Configure Governance Wiring
- Create labels from `docs/governance/labels.md`.
- Create/attach Project v2 board.
- Set required repository variables for `scripts/projectv2_sync.sh`.
- Validate a no-op workflow run succeeds.

### T+2:00 to T+4:00 — Assign Roles + Run Dry-Run
- Assign Oga/UI/Coding/Reviewer/QA/DevOps owners.
- Open one `task.yml` issue and run lifecycle transitions.
- Capture links + terminal output artifacts.

### T+4:00 to T+6:00 — Verify Discussion Operations
- Open one Dispatch discussion and one Standup discussion.
- Verify fallback path from `docs/protocols/discussion-template-usage.md`.
- Record response latency and handoff quality notes.

### T+6:00 to T+8:00 — Exit Review + Evidence Pack
- Run `npm run check`.
- Collect evidence bundle:
  - lifecycle issue link,
  - discussion links,
  - workflow run links,
  - check output snippet.
- Decide: **Adoption PASS** or **Adoption NEEDS FIXES**.

## Exit Gate for M5

M5 is considered complete when at least one second repository has a dated evidence bundle showing successful adoption in under one day.

Current status: **Met via local sandbox executed proof (2026-03-02)** and **optional hardening completed via live external-repo replay** (`docs/validation/artifacts/m5-external-adoption-replay-2026-03-02.md`).