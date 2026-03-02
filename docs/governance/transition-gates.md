# Transition Gate Matrix (Milestone 1)

Each transition requires **explicit artifact evidence** linked in issue/PR timeline.

## Intake -> Design
Required artifacts:
- Problem statement
- Scope + constraints
- Initial acceptance criteria

## Design -> Review Gate
Required artifacts:
- Design artifact (doc/diagram/mock)
- Architecture impact note (API/data/security/ops)
- Risks + tradeoffs

## Review Gate -> Decomposition
Required artifacts:
- Human approval evidence if policy requires
- Complexity score (`complexity:*`)
- Approval decision note (approved/revise/reject)

## Decomposition -> Execution
Required artifacts:
- Child tasks created for C4/C5 (linked issues)
- Dependency map (blocked-by / blocks)
- Role ownership assigned (`role:*`)

## Execution -> Verification
Required artifacts:
- PR linked to issue
- Build/test evidence (logs/check runs)
- Implementation notes/changelog summary
- Independent reviewer decision (not PR author)

## Verification -> Deployment
Required artifacts:
- QA pass report
- Edge-case checklist complete
- UI/design alignment confirmation (if user-facing)

## Deployment -> Done
Required artifacts:
- Deployment evidence (run ID/release link)
- Post-deploy sanity checks
- Rollback note (or "not needed" rationale)

## Rejection / Return Rules
- Verification fail -> return to Execution with defect bundle.
- Returned work gets `status:qa-return` and enters reserved fix window priority path.
- Missing transition artifacts must add `artifact:missing` and remain in current stage.
