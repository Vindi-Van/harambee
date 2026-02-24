# Workflow Rules (STRICTNESS: MUST)

## Task-Based Development
- Work must be broken into numbered tasks.
- One task is completed and verified before next task starts.
- Task tracker must be maintained in PR description or task artifact.

## Design Review Requirement
Must present design proposal and wait for approval for:
- large architecture changes
- public API changes
- data model changes
- major refactors

## Git Rules
- Commit format: `<type>: <short description>`
- Commits must be atomic and descriptive.
- Tests/lint/format should run before commit where implementation code is touched.

## Deliverable Rules
Each significant update should include:
- summary + motivation
- task tracker status
- changed files
- verification status
- docs/changelog updates
- open questions/limitations
