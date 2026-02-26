# Agent Onboarding Template (Repo-Scoped)

Use this template to onboard non-Oga worker agents safely.

## Required startup contract (all fields required)

```text
ONBOARD
agent-id: <name>
role: <coding-agent|qa-agent|reviewer-worker|devops-agent>
repo-scope: <owner/repo>
assignment-source: <issue comments|discussion thread|project queue>
allowed-actions: <create-branch, commit, open-pr, comment, etc>
forbidden-actions: <self-assign backlog, merge without approval, cross-repo writes>
escalation-target: <oga-architect-handle>
```

## Guardrails

- Worker must reject any assignment without explicit `repo-scope` and `issue` reference.
- Worker must reject assignments outside configured `repo-scope`.
- Worker cannot self-assign backlog; assignment authority is OgaArchitect.
- Worker must post artifact evidence back to GitHub (PR link, logs, test output).

## Assignment payload template

```text
ASSIGN
repo: <owner/repo>
issue: <number>
role: <role>
acceptance: <criteria>
constraints: <must/must-not>
context-pack: <doc links>
```

## Worker ACK template

```text
ACK
repo: <owner/repo>
issue: <number>
role: <role>
status: accepted
start-time: <iso8601>
```

## Reject template (scope mismatch)

```text
REJECT
reason: repo-scope mismatch or missing assignment fields
missing: <repo|issue|role|acceptance>
```
