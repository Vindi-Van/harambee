# M4 Validation — Redis Coordination Failure Simulation Checklist

Purpose: demonstrate safe reassignment behavior with optional Redis coordination enabled.

## Preconditions
- Redis available to Oga runtime.
- Coordination keys scoped to test namespace.
- At least 3 synthetic tasks prepared with mixed priorities.

## Test Matrix

### 1) Lease exclusivity (no double assignment)
- [x] Assign one task under contention from two workers.
- [x] Verify only one `lease:{taskId}` is accepted.
- [x] Capture logs proving CAS/token guard blocked duplicate lease.

### 2) Heartbeat timeout reclaim
- [x] Assign task to worker A.
- [x] Stop heartbeat for worker A.
- [x] Wait for TTL + reclaim grace.
- [x] Verify task transitions `assigned -> reclaiming -> queued -> assigned(worker B)`.
- [x] Post/record reclaim evidence artifact.

### 3) Reserved fix window protection
- [x] Put task in active fix window state.
- [x] Simulate delayed heartbeat inside fix window.
- [x] Confirm reclaim is deferred until fix window expires.

### 4) Retry cap and escalation
- [x] Force reclaim cycle to exceed `maxReclaimAttempts`.
- [x] Verify task escalates to blocker path (no infinite requeue loop).

## Exit Evidence Required
- [x] Command/test output proving all 4 scenarios passed.
- [x] Linked artifact logs with timestamps and task IDs.
- [x] Tracker updates in `docs/task-tracker.md` and `WORKBOARD.md`.

## Executed Evidence
- Artifact: `packages/oga/test/execution/m4RedisCoordinationSimulation.test.ts`
- Command: `npm test -- --run test/execution/m4RedisCoordinationSimulation.test.ts` (from `packages/oga`)
- Result: `✓ test/execution/m4RedisCoordinationSimulation.test.ts (4 tests)`
- Scenario/task IDs in simulation log history:
  - Lease exclusivity under contention: `task-701`
  - Stale-worker reclaim + reassignment: `task-702`
  - Reserved fix-window reclaim deferral: `task-703`
  - Retry-cap escalation to blocker: `task-704`

## Status
- Complete: executable simulation implementation and evidence captured.
