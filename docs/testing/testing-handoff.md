# Testing Handoff (Readiness Baseline)

_Last updated: 2026-03-03_

This is the **start-here** document for upcoming Harambee testing runs.

## 1) Where to start
1. Read current completion state:
   - `WORKBOARD.md`
   - `docs/task-tracker.md`
2. Read operator quickstart:
   - `docs/getting-started.md`
3. Pick a test lane:
   - Process smoke: `docs/testing/smoke-test-two-agents.md`
   - Execution handlers matrix: `docs/testing/github-execution-handlers-test-matrix.md`

## 2) Commands to run
```bash
git checkout main
git pull
npm install
npm run check
```

Optional targeted smoke:
```bash
npm --workspace @harambee/oga test -- --run test/execution/m2DispatchSimulation.test.ts
npm --workspace @harambee/oga test -- --run test/execution/m4RedisCoordinationSimulation.test.ts
```

## 3) Expected green baseline
- `WORKBOARD.md` status: **COMPLETE** (M1–M5 done; optional backlog only).
- `docs/task-tracker.md` status: M1–M5 complete, with only non-blocking/manual optional items.
- Git branch state at handoff capture:
  - `main` clean (`git status` shows no local changes)
  - no open PR backlog (`gh pr list --state open` returns empty)
- Local checks baseline:
  - `npm run check` passes (build + tests; 62 tests passed total on capture run)
- CI snapshot available:
  - Recent successful Actions run: <https://github.com/Vindi-Van/harambee/actions/runs/22602536446>

## 4) Where to file failures
Create a GitHub issue in `Vindi-Van/harambee` and include:
- Title prefix: `[TEST-FAIL]`
- Repro steps + exact command
- Expected vs actual behavior
- Environment (OS, Node version, commit SHA)
- Artifact links/log snippets

Suggested labels:
- `type:bug`
- `status:blocked` (if it prevents milestone-level validation), otherwise `status:ready`
- appropriate stage label (usually `stage:verification`)
