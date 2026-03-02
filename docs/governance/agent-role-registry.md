# Governance: Agent Role Registry (Canonical, v1)

## Purpose
Prevent role ambiguity and enforce a single active OgaArchitect per repo.

## Canonical Store
A dedicated GitHub issue in each managed repo:

- title: `[HARAMBEE] Agent Role Registry (Canonical)`
- labels: `harambee-registry`, `do-not-close`
- state: open

The CLI treats this issue as the single source of truth for role assignments.

## Required Sections (issue body)

```md
## Policy
- One active OgaArchitect per repo.
- Default role for new agents is `dev`.
- Role changes are logged in this issue.

## Active Agents
| Agent | Role | Status | Updated At |
|---|---|---|---|
| agent-name | dev | active | 2026-03-01T00:00:00Z |

## Change Log
- 2026-03-01T00:00:00Z — agent-name registered as dev
```

## Rules
1. `oga` registration:
   - allowed only if no other active Oga exists
   - otherwise blocked unless explicit owner override flag is used
2. non-oga registration:
   - update existing row or append new row
3. deactivation:
   - set status to `inactive` (do not delete rows)

## Anti-Accidental Closure Guard
Use a GitHub Action workflow:
- trigger on `issues.closed`
- if issue has label `harambee-registry`, auto-reopen and comment warning

## Discovery Order for CLI
1. find open issue with exact title + label
2. if not found, create it
3. if multiple found, fail fast and request manual cleanup

## Security/Integrity Notes
- all automated edits should be marker-based (section bounded)
- preserve human comments outside managed sections
- include actor + timestamp in each automated change log entry
