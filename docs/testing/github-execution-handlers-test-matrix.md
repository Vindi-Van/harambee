# GitHub Execution Handlers — Test Matrix (Assignment + Transition)

Scope: planned GitHub-backed execution handlers that consume `ExecutionAction` from `ExecutionDispatcher` and perform GitHub side effects (Issues/PRs/Projects/comments/labels/status).

Assumptions:
- Assignment handler applies assignment-side effects (assignee, labels, tracking comment, optional project field).
- Transition handler applies stage transition side effects (state label/status changes, project column/field updates, transition comment, optional PR status/check).
- Handlers receive `ExecutionAction` with `{ kind, requestId, allowed, reason }`.
- Idempotency key is derived from `requestId` (or explicit key).

---

## MVP First (P0)

These should be implemented first to safely ship Part 2.

| Priority | Handler | Test Type | Scenario | Setup / Mock | Expected Assertions |
|---|---|---|---|---|---|
| P0 | Assignment | Unit | Allowed assignment applies intended GitHub mutations | Mock GitHub client methods (`addAssignees`, `addLabels`, `createComment`) success | Correct methods called once with expected owner/repo/issue and payload derived from action/context |
| P0 | Assignment | Unit | Denied assignment is non-mutating but auditable | `allowed=false`, mock `createComment` only | No assignment/label mutations; denial audit comment created with `reason` |
| P0 | Transition | Unit | Allowed transition applies stage update | Mock label/project/comment methods success | Stage mutation(s) called once; transition comment includes from/to and `requestId` |
| P0 | Transition | Unit | Denied transition writes denial signal only | `allowed=false` | No stage-changing mutation; denial comment/event recorded |
| P0 | Assignment | Unit (failure) | GitHub API 500 during mutation is surfaced and contextualized | Make first write fail (`500`) | Handler throws typed error incl. operation name + requestId; partial mutation behavior documented |
| P0 | Transition | Unit (failure) | GitHub API rate limit/abuse response is retriable-classified | Mock 403 rate-limit headers | Error classification marks retriable; includes retry-after metadata (if present) |
| P0 | Shared | Unit (idempotency) | Same `requestId` replay does not duplicate side effects | Invoke handler twice with identical action | Second call no-ops (or performs safe read-only check); duplicate comments/labels not created |
| P0 | Shared | Contract | Handler -> GitHub client call contract remains stable | Contract fixture for action input + expected API calls | Snapshot/contract asserts endpoint names + required params shape |

---

## Important Next (P1)

| Priority | Handler | Test Type | Scenario | Setup / Mock | Expected Assertions |
|---|---|---|---|---|---|
| P1 | Assignment | Unit | Existing assignee/label already present | Mock API showing existing state | No duplicate label/assignee calls; still emits deterministic audit trace |
| P1 | Transition | Unit | Out-of-order transition request rejected safely | Current stage in GitHub mismatches expected `from` | No destructive mutation; explanatory comment or typed conflict error |
| P1 | Shared | Unit (failure) | Network timeout / ECONNRESET | Transport throws timeout/reset | Error mapped to retriable class; no idempotency key consumption on unknown commit outcome |
| P1 | Shared | Unit | Permission error (403 insufficient scope) | API returns 403 without rate-limit semantics | Non-retriable classification + operator-friendly remediation message |
| P1 | Shared | Unit (idempotency) | Same semantic mutation from different duplicate deliveries | Different envelopes, same idempotency key | Exactly-once side effects preserved |
| P1 | Shared | Contract | Serialization contract for comments/metadata | Golden fixture for comment body templates | Body includes requestId, decision, reason, timestamp format/version tag |
| P1 | Shared | Contract | Error contract to runtime loop | Simulate retriable/non-retriable errors | Returned/thrown error structure matches runtime expectations (`code`, `retriable`, `context`) |

---

## Hardening / Extended (P2)

| Priority | Handler | Test Type | Scenario | Setup / Mock | Expected Assertions |
|---|---|---|---|---|---|
| P2 | Assignment | Unit | Bulk assignment fan-out behavior (if batching enabled) | Multiple actions in sequence | Correct ordering/backpressure; isolated failure does not corrupt others |
| P2 | Transition | Unit | Multi-artifact transition (issue + PR + project item) partial failure | Fail 2nd of 3 operations | Compensating behavior or clear partial-failure report |
| P2 | Shared | Contract (integration-lite) | Live schema compatibility with Octokit response fragments | Mock server with realistic payload schema | Parser/mapper tolerates optional/missing fields |
| P2 | Shared | Property/idempotency | Fuzz duplicate/reordered deliveries | Randomized replay sequences | Final GitHub-visible state converges deterministically |

---

## Suggested Test Layout

- `packages/oga/test/execution/githubAssignmentHandler.test.ts`
- `packages/oga/test/execution/githubTransitionHandler.test.ts`
- `packages/oga/test/execution/githubExecutionIdempotency.test.ts`
- `packages/oga/test/contracts/githubExecutionHandler.contract.test.ts`

Use:
- **Unit**: Vitest + mocked GitHub client interface (preferred over raw Octokit in handler tests)
- **Failure simulation**: typed mock errors for 403/404/409/422/429/5xx + network timeouts
- **Contract**: fixture-driven assertions for outbound call shapes and error envelopes

---

## Minimal MVP Acceptance Gate

Before merge, require all P0 tests green:
1. Allowed/denied behavior for both handlers
2. API failure classification for both handlers
3. Idempotent replay for duplicate requestId
4. Contract fixture lock for outbound API shape

This gate ensures correctness, safety under retries, and integration stability for Part 2.