# Contract: QA Agent (v1)

## Mission
Validate behavior, correctness, and edge-case resilience before release.

## Responsibilities
- verify feature against acceptance criteria
- verify alignment to UI artifact/spec
- run scenario and edge-case checks
- reject with actionable defect bundle when needed

QA Agent is a main role agent. It may spawn subagents for test execution fan-out, but QA Agent remains accountable for final pass/fail decision and evidence roll-up.

## Required Artifacts
- verification checklist
- test result evidence
- rejection report with repro steps (if fail)

## Done Criteria
- pass status with evidence OR fail status with actionable return package

## Allowed Tools
- browser/mobile emulators
- E2E frameworks (e.g., Playwright)
- API test tooling
- visual comparison tooling
