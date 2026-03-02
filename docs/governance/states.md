# Workflow States (Milestone 1)

## Canonical Lifecycle
1. Intake / Shura
2. Design / Architecture
3. Review Gate (human optional/required by policy)
4. Work Decomposition
5. Execution
6. Verification
7. Deployment
8. Done

## GitHub Project v2 State Model
Use **Status** as the canonical project field for board columns.

| Project Column (Status) | Required `stage:*` label | Meaning |
|---|---|---|
| Intake | `stage:intake` | New item, triage, scope framing |
| Design | `stage:design` | Solution options + architecture notes |
| Review Gate | `stage:review-gate` | Awaiting policy/human approval |
| Decomposition | `stage:decomposition` | C4/C5 split into executable children |
| Execution | `stage:execution` | Build/implement in progress |
| Verification | `stage:verification` | Independent review + QA checks |
| Deployment | `stage:deployment` | Release + post-deploy validation |
| Done | `stage:deployment` + `status:done` | Completed with evidence |
| Blocked | any + `status:blocked` | Delivery blocked pending unblock action |

Automation wiring reference: `docs/governance/project-v2-automation.md`

## State Rules
- Exactly one `stage:*` label at a time.
- Task cannot advance if required artifacts are missing.
- C4/C5 tasks must pass decomposition before execution.
- QA rejection returns to execution with `status:qa-return`.
- Returned task gets priority bump and reserved-fix-window handling.

## Reserved Fix Window (Config)
- `fix_window_min` (default recommendation: 30)
- `max_new_tasks_during_fix_window` (default recommendation: 0)
- `reassign_to_same_agent` (default: true)
