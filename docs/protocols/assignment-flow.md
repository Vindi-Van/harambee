# Assignment Flow Protocol (M1/M2)

## Goal
Ensure OgaArchitect is the assignment authority while workers remain autonomous requesters.

## Operating Topology (codified)

- Role agents (OgaArchitect, Coding Agent, QA Agent, Reviewer Worker) are **main agents**.
- Main agents may spawn **subagents** for bounded subtasks, but accountability stays with the parent main agent.
- Subagent output must be reviewed/rolled up by the parent main agent before canonical GitHub updates.
- For current mode, assume **single project scope** unless explicitly configured otherwise.

## Flow (single-project default)
1. OgaArchitect comes online and establishes project/repo scope.
2. OgaArchitect structures backlog (epic/story/task hierarchy) with priority.
3. Worker main agent posts readiness signal.
4. Worker checks only configured repo scope for eligible work and requests assignment (does not self-assign).
5. OgaArchitect evaluates queue + policy + dependencies and assigns one eligible task.
6. Worker acknowledges assignment and moves task to in-progress.
7. Worker executes task (may spawn subagents for bounded subtasks).
8. Worker main agent consolidates subagent output and posts artifacts.
9. Worker requests transition; OgaArchitect/QA/Reviewer gates proceed per policy.

## Readiness Signal Format
Recommended comment/discussion payload:

```text
READY
worker: <worker-id>
role: <role>
capabilities: <comma-separated>
capacity: <n>
repo-scope: <owner/repo>
project-scope: <single-project-default|multi-project>
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
- Main agents can delegate to subagents, but only main agents update canonical GitHub state.
- Subagents must not independently claim backlog tasks.
- In single-project mode, worker checks one configured repo scope only.

## Timeout/Abandonment (GitHub-first)
- If no ACK in `ack_timeout_min`, OgaArchitect unassigns and requeues.
- If no progress update in `stale_timeout_min`, task marked `status:blocked` + escalation.

## Config Knobs
- `ack_timeout_min`
- `stale_timeout_min`
- `max_tasks_per_worker`
- `fix_window_min`
- `max_new_tasks_during_fix_window`
