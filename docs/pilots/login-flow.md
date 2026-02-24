# Pilot Flow: Add Login Feature

## Task Tracker
- [x] Task 1: Define lifecycle for login feature
- [x] Task 2: Define role handoffs and artifacts
- [x] Task 3: Define rejection/return and fix-window behavior

## Scenario
Implement a login capability where:
- UI must align to established brand guidelines.
- Dev must implement, test, and provide build evidence.
- Reviewer must independently review PR.
- QA verifies behavior + edge cases + UI alignment.
- OgaArchitect controls assignment and transitions.

## Stage Flow

### 1) Intake (OgaArchitect)
- Define objective, AC, constraints.
- Set complexity (`complexity:3` example).
- Attach context pack links.

### 2) Design (UI Agent)
- Produce UI artifact OR approve Clerk default UI with rationale.
- Provide responsive and accessibility notes.

### 3) Review Gate (Human policy-aware)
- If human-required policy is active, await approval.
- Else proceed with OgaArchitect approval.

### 4) Execution (Coding Agent)
- Implement login flow.
- Add unit/integration tests.
- Ensure build passes.
- Submit PR with evidence links.

### 5) Independent Review (Reviewer Worker)
- Review PR (must not be same coding agent).
- Approve or request changes.

### 6) Verification (QA)
- Validate AC, edge cases, and UI alignment.
- On fail: create QA Return artifact with repro + evidence.

### 7) Return Path
- Task gets `status:qa-return`.
- Coding agent enters reserved fix window.
- No new assignment until return resolved (per config).

### 8) Deployment (DevOps)
- Deploy after gates pass.
- Attach post-deploy sanity check and rollback note.

## Expected Artifacts
- UI spec/screenshot or Clerk-default decision
- PR link + test/build logs
- Reviewer decision
- QA report
- Deployment verification note
