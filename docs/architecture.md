# Harambee Architecture v1

## 1) Purpose

Harambee is a decentralized community orchestration framework for software delivery where a coordinated agent community executes work through a transparent, enforceable lifecycle.

## 2) Operating Model

### 2.1 OgaArchitect (combined role)

In v1, Oga and Architect are intentionally combined into **OgaArchitect**.

Responsibilities:
- intake with human
- refine requirements and constraints
- maintain `architecture.md` and project docs
- create tasks and complexity ratings
- decompose complex work into subtasks
- route work across role-specific agents
- enforce transitions and quality gates
- facilitate review with human

Future option: split into separate `Oga` and `Architect` roles when scale requires.

### 2.2 Agent Community

Example roles:
- UI Agent
- Coding Agent
- QA Agent
- DevOps Agent
- Planning Agent

Each role follows a contract (allowed actions, required artifacts, done criteria, best practices).

## 3) Canonical State Plane

**GitHub is the source of truth** for durable state:
- Issues (task records)
- PRs (code evidence)
- Projects/Kanban (workflow status)
- Discussions (coordination conversation)

### 3.1 Communication Policy

- Canonical workflow updates: Issues/PRs/Project fields
- Async team discussion: GitHub Discussions
- Human visibility/escalation: optional Telegram channel
- Any off-GitHub decision must be summarized back into GitHub

## 4) Coordination Plane

### 4.1 v1 Choice

Use GitHub-first dispatch with OgaArchitect-controlled assignment.

Flow:
1. worker indicates ready
2. OgaArchitect assigns task
3. worker executes and reports artifacts
4. stage transitions require evidence

This reduces race conditions because workers do not self-assign blindly.

### 4.2 Redis (optional-in-v1 / enabled when needed)

Redis can be colocated with OgaArchitect runtime to support:
- short-lived leases
- worker heartbeats
- lock TTL and stuck recovery
- dispatch cursors

Redis is **not** source of truth; GitHub remains canonical.

## 5) Compartmentalization (anti-corruption)

1. **Namespace isolation**
   - project key prefixes, labels, and branch naming policy
2. **Task workspace isolation**
   - one task = one branch/worktree/container context
3. **Prompt/context isolation**
   - each task gets a fresh context package
4. **Policy/auth isolation**
   - scoped actions by role and stage

## 6) Workflow State Machine

Default stage sequence:
1. Intake / Shura
2. Design / Architecture
3. Review Gate (human)
4. Work Decomposition
5. Execution
6. Verification (QA)
7. Deployment

### 6.1 Reserved Fix Window

After handoff, the prior stage owner enters a reserved fix window.
- returned issues from next stage take priority
- new task assignment can be blocked during window
- goal: reduce QA bounce-back backlog

## 7) Complexity and Fractal Decomposition

Complexity scale is 1–5 (5=max).

- C1/C2: small tasks, minimal ceremony
- C3: moderate tasks, full stage checks
- C4/C5: must decompose into child tasks

Parent tasks remain blocked until child criteria are satisfied.

## 8) Human Governance

Human can:
- comment on any issue/PR/discussion
- override priorities
- approve/reject review gate
- request decomposition changes
- demand architecture revisions

## 9) Future Architecture (deferred)

- multi-VPS private mesh (Tailscale/WireGuard)
- distributed worker pools
- real-time backplane (NATS/WebSocket)
- split Oga and Architect into separate services
- richer telemetry and reliability dashboards
