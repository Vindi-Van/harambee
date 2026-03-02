# Redis Coordination Protocol (Optional M4)

This protocol defines an **optional** Redis coordination plane for OgaArchitect when higher-concurrency dispatch requires lease/heartbeat semantics.

## Goals
- Prevent duplicate active assignment for the same task.
- Detect stuck workers quickly and reclaim safely.
- Preserve GitHub as source of truth (Redis is coordination cache only).

## Key Ownership
- **Owner:** OgaArchitect runtime only writes/updates coordination keys.
- Workers never mutate lease ownership keys directly.
- GitHub issue/PR/discussion state remains canonical for auditability.

## Key Schema (proposal)

Namespace: `harambee:{repo}`

- `lease:{taskId}` (HASH)
  - `workerId`
  - `assignedAt`
  - `leaseUntil`
  - `token` (opaque lease token)
  - `attempt`
- `worker:{workerId}:heartbeat` (STRING)
  - last heartbeat timestamp (epoch ms)
  - TTL: `2 * heartbeatInterval + jitter`
- `task:{taskId}:state` (STRING)
  - `queued | assigned | in_progress | reclaiming | complete`
- `queue:ready` (ZSET)
  - score: priority/time blend
  - member: taskId

## Lease Lifecycle
1. Oga pops next task from `queue:ready`.
2. Oga creates `lease:{taskId}` atomically if absent.
3. Worker receives assignment with `token`.
4. Worker emits heartbeat; Oga extends `leaseUntil` only if token matches.
5. On completion, Oga removes lease and updates GitHub artifacts.

## Reclaim Policy (stale worker)
- If heartbeat key expires OR `leaseUntil` passes grace window:
  1. Mark `task:{taskId}:state = reclaiming`.
  2. Verify no recent GitHub progress artifact (comment/check run) inside reclaim window.
  3. Increment `attempt`, release stale lease, requeue task.
  4. Post reclaim note to issue/discussion for traceability.

## Safety Constraints
- Reassign only via compare-and-swap semantics on lease token.
- Never issue concurrent valid leases for same task.
- Cap reclaim retries; escalate to blocker state after threshold.
- Respect reserved fix window from M2 before reclaiming active fixes.

## Suggested Defaults
- `heartbeatIntervalMs`: 15_000
- `leaseTtlMs`: 60_000
- `reclaimGraceMs`: 20_000
- `maxReclaimAttempts`: 3

## Observability
- Counters: `leases_acquired`, `leases_reclaimed`, `reassign_conflicts_prevented`.
- Log fields: `taskId`, `workerId`, `attempt`, `tokenPrefix`, `reason`.
- Daily summary in Oga status report for stale-task incidents.
