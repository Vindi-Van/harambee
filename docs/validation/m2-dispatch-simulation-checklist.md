# M2 Dispatch Simulation Validation Checklist

_Last updated: 2026-03-02_

## Scope
Validate M2 OgaArchitect dispatch protocol behavior with executable evidence for:
- worker-ready/request-task protocol run
- assignment ack/reject flow simulation
- reserved fix window enforcement simulation
- 3-task no-collision assignment proof

## Evidence Artifacts
- Test suite: `packages/oga/test/execution/m2DispatchSimulation.test.ts`
- Guard implementation under test: `packages/oga/src/policyGuards.ts`
- Policy values used: `config/policy.example.yaml`

## Validation Items

- [x] Worker-ready/request-task protocol run
  - Simulated READY signal with repo scope `Vindi-Van/harambee`
  - Simulated request-task payload for issue `#6201`
  - Guard decision returned `allowed: true`

- [x] Assignment ACK/Reject flow simulation
  - Simulated assignment for issue `#6202`
  - Simulated missing ACK at `ack_timeout_min = 15`
  - Simulated requeue + reassignment eligibility for issue `#6203`

- [x] Reserved fix window enforcement simulation
  - Policy confirms `max_new_tasks_during_fix_window = 0`
  - New assignment request during fix window rejected with `Worker in reserved fix window`

- [x] 3-task no-collision assignment proof
  - Queue simulated: issues `#6210`, `#6211`, `#6212`
  - Policy confirms `max_tasks_per_worker = 1`
  - First assignment allowed, second/third denied with `Worker at max task capacity`

## Command Output (local)

```bash
npm run -w @harambee/oga test -- m2DispatchSimulation.test.ts
# ✓ test/execution/m2DispatchSimulation.test.ts (4 tests)
# Tests 4 passed (4)
```

```bash
npm run check
# monorepo build + tests passed
# @harambee/cli: 13 passed
# @harambee/oga: 44 passed
# @harambee/policy: 2 passed
```

## Exit Decision
M2 dispatch simulation evidence is complete for protocol behavior and anti-collision proof at policy-guard level.
