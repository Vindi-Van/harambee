# M1 Project v2 Governance-State Hardening (2026-03-02)

## Goal
Add full governance-state granularity to Project v2 mapping without breaking existing board behavior based on built-in `Status`.

## Actions Executed

1. Created Project v2 single-select field:
   - Project: `Vindi-Van` / #3
   - Field name: `Governance State`
   - Options: `Intake, Design, Review Gate, Decomposition, Execution, Verification, Deployment, Blocked, Done`

2. Retrieved IDs and set repo variables:
   - `PROJECT_V2_GOV_FIELD_ID`
   - `PROJECT_V2_GOV_OPT_{INTAKE,DESIGN,REVIEW_GATE,DECOMPOSITION,EXECUTION,VERIFICATION,DEPLOYMENT,BLOCKED,DONE}`

3. Updated automation:
   - Workflow now passes optional `PROJECT_V2_GOV_*` vars.
   - Sync script now updates:
     - required coarse field: `Status`
     - optional full-granularity field: `Governance State`

4. Ran manual sync on sample issue:

```bash
scripts/projectv2_sync.sh Vindi-Van/harambee 77
```

## Captured IDs

- `PROJECT_V2_GOV_FIELD_ID=PVTSSF_lAHOA23KYM4BQmW3zg-rbM4`
- `Intake=4c9571de`
- `Design=c9e4d9b8`
- `Review Gate=e72500f3`
- `Decomposition=a7a9bcb0`
- `Execution=8488fafc`
- `Verification=e821022b`
- `Deployment=9cf8f56a`
- `Blocked=c48623b8`
- `Done=da85defd`

## Verification Output

Project item query (issue #77 item `PVTI_lAHOA23KYM4BQmW3zgmgBg4`):

```text
Status=Done (98236657)
Governance State=Done (da85defd)
```

## Raw command transcript

- `docs/validation/artifacts/m1-projectv2-governance-field-run-2026-03-02.txt`
