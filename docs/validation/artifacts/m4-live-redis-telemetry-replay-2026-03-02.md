# M4 Live Redis + Telemetry Replay (2026-03-02)

Status: **Closest-feasible simulation with persisted telemetry export** (host lacks Docker daemon access for live Redis container).

## Scenario Results

1. Lease exclusivity (task-701)
   - worker-a acquired lease: true
   - worker-b blocked duplicate lease: true
2. Stale-worker reclaim + reassignment (task-702)
   - reclaimed to queue: true
   - reassigned to worker-b: true
3. Reserved fix-window deferral (task-703)
   - reclaim deferred while fix-window active: true
   - reclaim succeeded after window expiry: true
4. Retry-cap escalation (task-704)
   - escalated to blocker after max attempts: true

## Telemetry Export
- JSONL artifact: `docs/validation/artifacts/m4-live-redis-telemetry-2026-03-02.jsonl`
- Event count: 14

## Notes
- Replay follows the same M4 reclaim semantics validated in `packages/oga/test/execution/m4RedisCoordinationSimulation.test.ts`.
- To run true live Redis replay later, execute this flow with Docker daemon or host Redis access and preserve the same JSONL schema.
