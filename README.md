# Harambee

Harambee = "all pull together."

A GitHub-native community orchestration framework where specialized agents collaborate across the software lifecycle with clear roles, artifact-driven progress, and human-visible governance.

## v1 Scope (Current)

This repo currently contains the **v1 design docs** and execution plan for:
- OgaArchitect-led orchestration (combined Oga + Architect role)
- GitHub-first canonical workflow (Issues/PRs/Projects/Discussions)
- Role contracts and handoff gates
- Complexity rubric (1–5)
- Reserved fix windows after stage handoff

## Core Principles

1. **State is visible** (GitHub is canonical)
2. **No blind handoffs** (artifact-linked transitions)
3. **Compartmentalized execution** (task isolation + context isolation)
4. **Human oversight** (approval gates and escalation)
5. **Fractal consistency** (large efforts decompose into same lifecycle)

## Docs Index

- `docs/getting-started.md` — 10-minute operator quickstart
- `docs/install.md` — Requirements, permissions, setup, and governance bootstrap
- `docs/cli-walkthrough.md` — Day-0/day-1 command walkthrough (`gh` + optional OpenClaw)
- `docs/architecture.md` — System design and workflow model
- `docs/milestones.md` — Milestones, phases, and delivery checkpoints
- `docs/task-breakdown.md` — Actionable work packages
- `docs/contracts/` — Role contracts (including Reviewer Worker)
- `docs/governance/` — Labels, states, transition gates, PR approval policy, and standards
- `docs/protocols/` — Assignment and discussion protocols
- `docs/pilots/` — End-to-end pilot execution examples
- `docs/rubrics/complexity.md` — Complexity scoring system
- `config/policy.example.yaml` — Configurable workflow/policy controls
- `CONTEXT.md` / `CHANGELOG.md` — architecture decision log and change history

## Immediate Next Step

Approve v1 docs, then start implementation with:
1. workflow schemas
2. issue/label conventions
3. Oga dispatch loop (GitHub-first)
