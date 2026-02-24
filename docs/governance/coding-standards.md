# Coding Standards (STRICTNESS: MUST)

These standards are mandatory for Harambee implementation.

## Core Rules
- New functionality must be modular and testable.
- Business logic must be separated from I/O.
- Type safety is required (TypeScript required; Python with type hints where used).
- Explicit error handling and input validation are required.
- Formatter and linter must pass before commit.
- Public functions/classes/modules require docstrings/docs comments.
- Unit tests are required for business logic; API handlers must be tested.
- No secrets in source control.

## Repository-Specific Additions
- PR author cannot self-approve implementation PRs.
- Reviewer Worker approval is required before merge.
- Human approval mode is configurable (all PRs vs critical-only).
- Transition gates must include linked evidence artifacts.

## Verification Baseline
- Build/test/lint must pass for merge-eligible PRs.
- Regression test required for bug fixes.
- Edge-case validation required for QA stage.
