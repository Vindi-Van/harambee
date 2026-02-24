# Workflow States (Milestone 1)

## Canonical Stages
1. Intake / Shura
2. Design / Architecture
3. Review Gate (human optional/required by policy)
4. Work Decomposition
5. Execution
6. Verification
7. Deployment

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
