# Smoke Test: 2 Agents, 1 Project (Sandbox Lane)

Purpose: validate Harambee workflow without contaminating production planning.

## Scope
- Repo: one sandbox repo (or one sandbox-labeled lane in target repo)
- Agents:
  - Agent A: OgaArchitect
  - Agent B: Coding Agent
- Duration target: 15-30 minutes

## Pre-checks
- [ ] GitHub auth valid for both operator/runtime contexts (`gh auth status`)
- [ ] Sandbox label exists (`sandbox`)
- [ ] Test title prefix agreed (`[SMOKE]`)
- [ ] Merge policy known (human approval requirement)

## Test flow
1. Create issue:
   - Title: `[SMOKE] Hello Harambee`
   - Include acceptance criteria:
     - tiny code/docs change
     - PR linked to issue
     - evidence comment on issue after merge
2. OgaArchitect posts assignment payload (repo + issue + role + constraints).
3. Coding Agent ACKs and executes one bounded change.
4. Coding Agent opens PR with test/build evidence.
5. Review + merge per repo policy.
6. Close issue with PR + commit evidence.

## Pass criteria
- [ ] Issue moved from open -> closed with evidence comment
- [ ] Exactly one PR opened and merged
- [ ] Assignment authority respected (no self-assignment)
- [ ] No non-sandbox issues/labels modified

## Cleanup
- [ ] Confirm no dangling branches from smoke run
- [ ] Keep artifacts (issue/PR) tagged `[SMOKE]` for auditability
- [ ] Optional: move smoke items to archive column/state
