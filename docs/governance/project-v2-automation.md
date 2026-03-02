# GitHub Project v2 Automation Mapping

This document wires Harambee governance labels/states into GitHub Project v2 fields.

## Source of Truth

- Lifecycle/stage labels: `docs/governance/states.md`, `docs/governance/labels.md`
- Transition gates: `docs/governance/transition-gates.md`
- Automation implementation:
  - Workflow: `.github/workflows/projectv2-governance-sync.yml`
  - Script: `scripts/projectv2_sync.sh`

## Mapping Rules (Label/State -> Governance Key)

Precedence order (top wins):

1. Issue closed OR `status:done` -> `done`
2. `status:blocked` -> `blocked`
3. `stage:deployment` -> `deployment`
4. `stage:verification` -> `verification`
5. `stage:execution` -> `execution`
6. `stage:decomposition` -> `decomposition`
7. `stage:review-gate` -> `review_gate`
8. `stage:design` -> `design`
9. `stage:intake` (or default) -> `intake`

## Project Field Strategy

### 1) Required field (coarse): `Status`

GitHub built-in `Status` is still updated to keep board grouping/automation stable.

Current project options in #3:
- `Todo`
- `In progress`
- `Done`

Repo variable mapping (coarse):
- Intake/Design/Review Gate/Blocked -> `Todo`
- Decomposition/Execution/Verification/Deployment -> `In progress`
- Done -> `Done`

### 2) Optional hardening field (full granularity): `Governance State`

To preserve full Harambee lifecycle fidelity, automation also updates a dedicated single-select field when configured:

- `Intake`
- `Design`
- `Review Gate`
- `Decomposition`
- `Execution`
- `Verification`
- `Deployment`
- `Blocked`
- `Done`

This gives exact governance-state visibility even when built-in `Status` remains compressed.

## Required Repo Variables

Base required vars (existing):
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

Optional full-governance vars (new hardening):
- `PROJECT_V2_GOV_FIELD_ID`
- `PROJECT_V2_GOV_OPT_INTAKE`
- `PROJECT_V2_GOV_OPT_DESIGN`
- `PROJECT_V2_GOV_OPT_REVIEW_GATE`
- `PROJECT_V2_GOV_OPT_DECOMPOSITION`
- `PROJECT_V2_GOV_OPT_EXECUTION`
- `PROJECT_V2_GOV_OPT_VERIFICATION`
- `PROJECT_V2_GOV_OPT_DEPLOYMENT`
- `PROJECT_V2_GOV_OPT_DONE`
- `PROJECT_V2_GOV_OPT_BLOCKED`

Optional repository secret:
- `PROJECT_V2_TOKEN` (recommended PAT with `project` + `repo` scopes when project is org/user-scoped and `github.token` lacks access)

## Access Requirement (hard)

Agents/operators must have access to:
- the repository (for issues/labels/workflow updates), and
- the GitHub Project v2 (for project item and field writes).

`gh` must be authenticated with `read:project` (and `project` for writes).

## Migration Procedure (Executed on 2026-03-02, Project #3)

1. Create the full-granularity field:

```bash
gh project field-create 3 \
  --owner Vindi-Van \
  --name "Governance State" \
  --data-type SINGLE_SELECT \
  --single-select-options "Intake,Design,Review Gate,Decomposition,Execution,Verification,Deployment,Blocked,Done"
```

2. Inspect field/option IDs:

```bash
gh project field-list 3 --owner Vindi-Van --format json
```

3. Set repo variables for the new field and options:

```bash
gh variable set PROJECT_V2_GOV_FIELD_ID --repo Vindi-Van/harambee --body <field-id>
gh variable set PROJECT_V2_GOV_OPT_INTAKE --repo Vindi-Van/harambee --body <option-id>
# ...repeat for DESIGN, REVIEW_GATE, DECOMPOSITION, EXECUTION,
# VERIFICATION, DEPLOYMENT, BLOCKED, DONE
```

4. Ensure workflow passes optional vars and script updates both fields.

## Verification Checklist

- [ ] `gh project field-list` shows `Governance State` with all 9 options.
- [ ] Repo vars `PROJECT_V2_GOV_*` are populated.
- [ ] Trigger any issue label transition (or run workflow via issue label event).
- [ ] In Project item, built-in `Status` remains coarse (`Todo`/`In progress`/`Done`).
- [ ] `Governance State` reflects exact stage (`Intake`/`Design`/.../`Done`/`Blocked`).
- [ ] Closed issue lands on `Governance State=Done` and `Status=Done`.

## Live Configuration Captured (Project #3, 2026-03-02)

Project:
- URL: <https://github.com/users/Vindi-Van/projects/3>
- `PROJECT_V2_ID=PVT_kwHOA23KYM4BQmW3`
- `PROJECT_V2_STATUS_FIELD_ID=PVTSSF_lAHOA23KYM4BQmW3zg-q_dk`
- `PROJECT_V2_GOV_FIELD_ID=PVTSSF_lAHOA23KYM4BQmW3zg-rbM4`

`Governance State` options:
- `Intake` -> `4c9571de`
- `Design` -> `c9e4d9b8`
- `Review Gate` -> `e72500f3`
- `Decomposition` -> `a7a9bcb0`
- `Execution` -> `8488fafc`
- `Verification` -> `e821022b`
- `Deployment` -> `9cf8f56a`
- `Blocked` -> `c48623b8`
- `Done` -> `da85defd`

Executed command transcript:
- `docs/validation/artifacts/m1-projectv2-governance-state-hardening-2026-03-02.md`

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
3. Confirm item appears in project with `Governance State=Intake` and `Status=Todo`.
4. Transition labels through execution/verification/deployment.
5. Confirm `Governance State` tracks exact stage while `Status` stays coarse.
6. Close issue and confirm both fields move to done.

Latest baseline evidence before hardening:
- Sample issue: <https://github.com/Vindi-Van/harambee/issues/77>
- Command log: `docs/validation/artifacts/m1-projectv2-live-validation-2026-03-02.txt`
- Observed statuses: `Todo -> In progress -> In progress -> Done`
