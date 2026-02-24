# CONTEXT.md (packages/oga)

## Purpose
`@harambee/oga` provides policy enforcement guards for assignment and transition decisions.

## Owned Contracts
- Assignment allow/deny checks
- Stage transition allow/deny checks
- Human-approval requirement checks

## Change Log
### 2026-02-24 — Initial scaffold (Matrim)
- Added typed guard inputs/outputs.
- Added assignment and transition guard functions.
- Added unit tests for key policy paths.

### 2026-02-24 — Runtime service scaffold (Matrim)
- Added `OgaRuntimeService` for assignment and transition evaluation.
- Added service-level tests for decision behavior.

### 2026-02-24 — Adapter routing scaffold (Matrim)
- Added assignment/transition/webhook adapter handlers.
- Added normalized adapter output envelopes.
- Added adapter-level tests for routing + decision behavior.

### 2026-02-24 — Execution handler bindings scaffold (Matrim)
- Added execution action contracts and dispatcher.
- Added in-memory handlers for side-effect-safe routing.
- Added runtime binding helpers from adapter inputs to handlers.
- Added tests for assignment/transition binding flow.

### 2026-02-24 — GitHub assignment handler scaffold (Matrim)
- Added `GitHubClient` interface boundary for DI/mocking.
- Added `GitHubAssignmentHandler` for allowed/denied assignment actions.
- Added P0 unit tests for mutation and denial-audit behavior.
