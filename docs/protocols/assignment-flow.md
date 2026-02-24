# Assignment Flow Protocol (M1/M2)

## Goal
Ensure OgaArchitect is the assignment authority while workers remain autonomous requesters.

## Flow
1. Worker posts readiness signal
2. OgaArchitect evaluates queue + policy + dependencies
3. OgaArchitect assigns one eligible task
4. Worker acknowledges assignment
5. Worker updates task status to in-progress
6. Worker delivers artifacts and requests transition

## Readiness Signal Format
Recommended comment/discussion payload:

```text
READY
worker: <worker-id>
role: <role>
capabilities: <comma-separated>
capacity: <n>
project-scope: <keys or all>
```

## Assignment Response Format

```text
ASSIGN
task: <issue-number>
role: <role>
due: <target>
context-pack: <doc links>
constraints: <must/must-not>
```

## Guardrails
- Worker cannot self-assign from backlog directly.
- OgaArchitect must verify dependency readiness before assignment.
- C4/C5 tasks cannot be assigned to execution before decomposition completion.
- QA-return tasks override normal queue order for same worker during fix window.

## Timeout/Abandonment (GitHub-first)
- If no ACK in `ack_timeout_min`, OgaArchitect unassigns and requeues.
- If no progress update in `stale_timeout_min`, task marked `status:blocked` + escalation.

## Config Knobs
- `ack_timeout_min`
- `stale_timeout_min`
- `max_tasks_per_worker`
- `fix_window_min`
- `max_new_tasks_during_fix_window`
