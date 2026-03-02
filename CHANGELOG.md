# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [Unreleased]

### Added
- Root `CONTEXT.md` with decision log and architecture context.
- Governance standards docs for coding + workflow requirements.
- Policy config template for orchestration controls.
- Pilot login-flow artifact defining end-to-end lifecycle.
- Initial TypeScript policy package scaffold (`@harambee/policy`).
- Runtime YAML policy loader with schema validation.
- Unit tests for valid/invalid policy config loading.
- Initial Oga runtime guard package scaffold (`@harambee/oga`).
- Assignment and transition guard helpers using loaded runtime policy.
- Unit tests for Oga guard behavior.
- `OgaRuntimeService` scaffold for policy-backed assignment/transition decisions.
- Unit tests for Oga runtime service behavior.
- Adapter handlers for assignment, transition, and webhook payload inputs.
- Unit tests for adapter routing and normalized decision outputs.
- Execution handler contracts, dispatcher, and in-memory handler scaffold.
- Runtime bindings from adapter decisions to execution handlers.
- Unit tests for execution binding flow.
- GitHub assignment execution handler scaffold with injected GitHub client boundary.
- P0 tests for allowed/denied assignment mutation behavior.
- GitHub transition execution handler scaffold with idempotent request handling.
- P0 tests for allowed/denied transition mutation behavior.
- GitHub execution error wrapper + optional client-side error classification hook.
- Retryability-aware error propagation in assignment/transition handlers.
- GitHub issue templates for `Bug Task` and `Blocker` workflow intake.
