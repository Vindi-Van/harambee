# M4 Validation — Redis Coordination Failure Simulation Checklist

Purpose: demonstrate safe reassignment behavior with optional Redis coordination enabled.

## Preconditions
- Redis available to Oga runtime.
- Coordination keys scoped to test namespace.
- At least 3 synthetic tasks prepared with mixed priorities.

## Test Matrix

### 1) Lease exclusivity (no double assignment)
- [ ] Assign one task under contention from two workers.
- [ ] Verify only one `lease:{taskId}` is accepted.
- [ ] Capture logs proving CAS/token guard blocked duplicate lease.

### 2) Heartbeat timeout reclaim
- [ ] Assign task to worker A.
- [ ] Stop heartbeat for worker A.
- [ ] Wait for TTL + reclaim grace.
- [ ] Verify task transitions `assigned -> reclaiming -> queued -> assigned(worker B)`.
- [ ] Post/record reclaim evidence artifact.

### 3) Reserved fix window protection
- [ ] Put task in active fix window state.
- [ ] Simulate delayed heartbeat inside fix window.
- [ ] Confirm reclaim is deferred until fix window expires.

### 4) Retry cap and escalation
- [ ] Force reclaim cycle to exceed `maxReclaimAttempts`.
- [ ] Verify task escalates to blocker path (no infinite requeue loop).

## Exit Evidence Required
- [ ] Command/test output proving all 4 scenarios passed.
- [ ] Linked artifact logs with timestamps and task IDs.
- [ ] Tracker updates in `docs/task-tracker.md` and `WORKBOARD.md`.

## Status
- Started (planning + protocol spec drafted).
- Pending executable simulation implementation.
