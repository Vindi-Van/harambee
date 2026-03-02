# GitHub Project v2 Automation Mapping

This document wires Harambee governance labels/states into a GitHub Project v2 **Status** field.

## Source of Truth

- Lifecycle/stage labels: `docs/governance/states.md`, `docs/governance/labels.md`
- Transition gates: `docs/governance/transition-gates.md`
- Automation implementation:
  - Workflow: `.github/workflows/projectv2-governance-sync.yml`
  - Script: `scripts/projectv2_sync.sh`

## Mapping Rules (Label/State -> Project Status)

Precedence order (top wins):

1. Issue closed OR `status:done` -> **Done**
2. `status:blocked` -> **Blocked**
3. `stage:deployment` -> **Deployment**
4. `stage:verification` -> **Verification**
5. `stage:execution` -> **Execution**
6. `stage:decomposition` -> **Decomposition**
7. `stage:review-gate` -> **Review Gate**
8. `stage:design` -> **Design**
9. `stage:intake` (or default) -> **Intake**

This aligns with canonical lifecycle and preserves blocked/done overrides.

## Required Repo Variables

Set these repository variables before enabling full automation:

- `PROJECT_V2_ID`
- `PROJECT_V2_STATUS_FIELD_ID`
- `PROJECT_V2_OPT_INTAKE`
- `PROJECT_V2_OPT_DESIGN`
- `PROJECT_V2_OPT_REVIEW_GATE`
- `PROJECT_V2_OPT_DECOMPOSITION`
- `PROJECT_V2_OPT_EXECUTION`
- `PROJECT_V2_OPT_VERIFICATION`
- `PROJECT_V2_OPT_DEPLOYMENT`
- `PROJECT_V2_OPT_DONE`
- `PROJECT_V2_OPT_BLOCKED`

Optional repository secret:

- `PROJECT_V2_TOKEN` (recommended PAT with `project` + `repo` scopes when project is org/user-scoped and `github.token` lacks access)

## Access Requirement (hard)

Agents/operators must have access to:
- the repository (for issues/labels/workflow updates), and
- the GitHub Project v2 (for project item and status-field writes).

`gh` must be authenticated with `read:project` (and `project` for writes).

## How to Fetch IDs (one-time)

```bash
# List projects for owner
gh project list --owner <owner>

# Inspect a project (copy project id, field ids, option ids)
gh project view <number> --owner <owner> --format json
```

Then copy IDs into repo variables.

## Live Configuration Captured (Project #3, 2026-03-02)

Project:
- URL: <https://github.com/users/Vindi-Van/projects/3>
- `PROJECT_V2_ID=PVT_kwHOA23KYM4BQmW3`
- `PROJECT_V2_STATUS_FIELD_ID=PVTSSF_lAHOA23KYM4BQmW3zg-q_dk`

Status options currently available in this project:
- `Todo` -> `f75ad846`
- `In progress` -> `47fc9ee4`
- `Done` -> `98236657`

Applied repo-variable mapping (compressed to current 3-state project schema):
- `PROJECT_V2_OPT_INTAKE=f75ad846`
- `PROJECT_V2_OPT_DESIGN=f75ad846`
- `PROJECT_V2_OPT_REVIEW_GATE=f75ad846`
- `PROJECT_V2_OPT_DECOMPOSITION=47fc9ee4`
- `PROJECT_V2_OPT_EXECUTION=47fc9ee4`
- `PROJECT_V2_OPT_VERIFICATION=47fc9ee4`
- `PROJECT_V2_OPT_DEPLOYMENT=47fc9ee4`
- `PROJECT_V2_OPT_BLOCKED=f75ad846`
- `PROJECT_V2_OPT_DONE=98236657`

Scope validation:
- `gh auth status` reports active token scopes include `project`, `repo`, and `workflow`.

## Local Manual Sync Command

```bash
# Uses current GH_TOKEN + repo variables exported in shell
authority_repo="Vindi-Van/harambee"
issue_number="<issue-number>"
scripts/projectv2_sync.sh "$authority_repo" "$issue_number"
```

## Validation Protocol (minimum evidence)

1. Create or pick one sample issue.
2. Add stage/status labels (`stage:intake`, `status:ready`) and trigger workflow.
3. Confirm issue appears in project with **Intake** status.
4. Transition labels to `stage:execution`, then `stage:verification`, then close issue.
5. Confirm project item status transitions: **Execution** -> **Verification** -> **Done**.
6. Save command/run links in `docs/validation/m1-dry-run-validation-checklist.md`.

Latest executed evidence:
- Sample issue: <https://github.com/Vindi-Van/harambee/issues/77>
- Command log: `docs/validation/artifacts/m1-projectv2-live-validation-2026-03-02.txt`
- Observed statuses: `Todo -> In progress -> In progress -> Done`
