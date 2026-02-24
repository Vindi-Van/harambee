# Harambee Milestones (v1)

## M0 — Foundation Docs (current)

Deliverables:
- architecture v1
- milestones
- task breakdown
- role contracts
- complexity rubric

Exit criteria:
- human approval of v1 design baseline

## M1 — Workflow Schema & Governance

Deliverables:
- issue templates (task, bug, design request, blocker)
- label taxonomy
- project column/state definitions
- transition rules (artifact required)

Exit criteria:
- dry-run of one sample task through full lifecycle

## M2 — OgaArchitect Dispatch (GitHub-first)

Deliverables:
- worker-ready and request-task protocol
- Oga assignment protocol
- assignment ack/reject flow
- reserved fix window enforcement

Exit criteria:
- 3 simulated tasks assigned without race/collision

## M3 — Contracts in Practice

Deliverables:
- UI/Coding/QA/DevOps contract checklists applied in task templates
- evidence gates per stage
- QA bounce-back loop and priority return

Exit criteria:
- at least 1 end-to-end feature flow passes with bounce-back handling

## M4 — Optional Redis Coordination

Deliverables:
- lease/heartbeat lock schema (if enabled)
- stuck-worker timeout/reclaim behavior

Exit criteria:
- failure simulation demonstrates safe reassignment

## M5 — Starter Kit

Deliverables:
- reusable repo template
- bootstrap docs for new teams
- ops guidance for single-VPS deployment

Exit criteria:
- second project can adopt Harambee in <1 day
