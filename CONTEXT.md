# CONTEXT.md

## Architecture Context

Harambee is a GitHub-native orchestration framework with OgaArchitect-led flow control, role contracts, artifact-gated transitions, and human-visible governance.

Core references:
- `docs/architecture.md`
- `docs/governance/`
- `docs/contracts/`
- `docs/protocols/`

## Decision Log

### 2026-02-24 — OgaArchitect Mode (combined)
- Combined Oga + Architect for v1 velocity.
- Keep split option for future scaling.

### 2026-02-24 — GitHub-first Communication
- GitHub is canonical state and communication plane.
- Discussions are optional for async coordination.

### 2026-02-24 — Independent Reviewer Rule
- Coding Agent cannot be sole approver for own PR.
- Reviewer Worker and/or OgaArchitect required.

### 2026-02-24 — Reserved Fix Window
- Post-handoff fix window required and configurable.
- Returned work receives priority over new assignments.

### 2026-02-24 — Standards Strictness
- Coding and workflow standards set to MUST-level.
- Task-based development and verification required.

### 2026-02-24 — Typed Policy Loader Scaffold
- Added TypeScript policy package with runtime validation.
- Added YAML policy parsing + Zod schema checks.
- Added initial tests for valid/invalid policy paths.
- Agent: Matrim

### 2026-02-24 — Oga Runtime Policy Guards
- Added `@harambee/oga` package scaffold.
- Implemented assignment and transition guard helpers.
- Added policy-driven human approval and decomposition checks.
- Added unit tests for guard behavior.
- Agent: Matrim
