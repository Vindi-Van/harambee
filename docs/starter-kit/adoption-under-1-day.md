# M5 Starter Kit — Adoption in <1 Day (Guide Skeleton)

This is the execution skeleton for proving a second project can adopt Harambee in under one working day.

## Target Outcome

Within 8 hours, a new repository can:
- intake work through Harambee issue templates,
- run Oga-style assignment/discussion protocol,
- move state in Project v2 with governance automation,
- and produce at least one full lifecycle artifact trail.

## Timeboxed Plan (T+0 to T+8h)

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

## Evidence Bundle Template

- Project/repo:
- Date:
- Operators:
- Lifecycle sample issue:
- Discussion sample(s):
- Workflow run(s):
- Check command + result:
- Risks found:
- Recommended follow-up:

## Exit Gate for M5

Mark M5 complete when at least one second repository has a dated evidence bundle showing successful adoption in under one day.
