# Transition Gate Matrix (Milestone 1)

## Intake -> Design
Required:
- problem statement
- scope and constraints
- initial acceptance criteria

## Design -> Review Gate
Required:
- design artifact (doc/screenshot/reference)
- architecture impact note
- risks + tradeoffs

## Review Gate -> Decomposition
Required:
- human approval if policy requires
- complexity score assigned

## Decomposition -> Execution
Required:
- child tasks created for C4/C5
- dependencies linked
- ownership/role assigned

## Execution -> Verification
Required:
- PR linked
- build/test evidence
- implementation notes
- independent reviewer decision (not PR author)

## Verification -> Deployment
Required:
- QA pass report
- edge-case checklist complete
- UI alignment confirmation

## Deployment -> Done
Required:
- deployment evidence
- post-deploy sanity checks
- rollback note

## Rejection / Return Rules
- Verification fail -> return to Execution with defect bundle.
- Returned work gets `status:qa-return` and enters reserved fix window priority path.
