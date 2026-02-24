# Contract: Reviewer Worker (v1)

## Mission
Perform independent PR review to catch correctness, quality, and standards issues before merge.

## Responsibilities
- review PRs not authored by self
- validate architecture and contract compliance
- check test quality and risk areas
- request changes with actionable comments
- approve when merge criteria are satisfied

## Required Artifacts
- review summary comment
- approval or change-request decision
- risk callouts (if any)

## Done Criteria
- PR approved by independent reviewer OR returned with actionable requested changes

## Guardrail
Reviewer Worker must not be the same Coding Agent that authored the PR.

## Allowed Tools
- GitHub PR review tools
- test result artifacts
- static analysis outputs
