# Harambee Getting Started (10-Minute Operator Guide)

This guide gets a single operator from zero to a usable Harambee workflow.

## What Harambee is (quick definition)

Harambee is a **GitHub-native orchestration framework** where role-based agents execute software-delivery work through Issues, PRs, and policy gates.

- GitHub = canonical state plane
- OgaArchitect = assignment authority in v1
- Agents = workers that execute scoped role contracts

## Key definitions

- **Agent**: a role-bound worker (human or automated) that executes tasks under a contract (Coding Agent, QA Agent, Reviewer Worker, etc.).
- **OpenClaw instance**: one running OpenClaw runtime that can host an orchestration brain and/or workers, with tool access (GitHub, messaging, etc.).
- **OgaArchitect**: combined intake + architecture + assignment role in v1.

## Fast path

1. You have a project idea to build.
2. Start Harambee with OgaArchitect (main role) and discuss requirements/features.
3. OgaArchitect converts requirements into issue hierarchy (epics/stories/tasks) in GitHub.
4. OgaArchitect requests architecture approval where required.
5. OgaArchitect assigns execution tasks to worker roles.
6. Workers implement via PRs, run review/QA gates, then merge.

Under the hood prerequisites:
- Clone repo and install deps
- Ensure GitHub auth is working (`gh auth status`)
- Create baseline labels/project workflow in GitHub (if not already present)

---

## 1) Clone and install

```bash
git clone https://github.com/Vindi-Van/harambee.git
cd harambee
npm install
```

## 2) Validate local checks

```bash
npm run check
```

## 3) Validate GitHub CLI access

```bash
gh auth status
gh repo view Vindi-Van/harambee
```

## 4) Run one assignment cycle

- Worker posts readiness comment (see `docs/protocols/assignment-flow.md`)
- OgaArchitect assigns one eligible issue
- Worker opens PR with artifact evidence
- Reviewer Worker / human reviews
- Merge and log completion

## 5) Can OgaArchitect create repo/project, or must they pre-exist?

- **Repo:** can pre-exist (common) or be created by OgaArchitect/operator if permissions allow.
- **GitHub Project board:** recommended to create early; can also be created by OgaArchitect/operator if permissions allow.
- **Minimum viable start:** existing repo + issue/PR permissions.

## 6) First 30 minutes (2 OpenClaw agents)

If you already have 2 OpenClaw agents running:

1. Assign roles:
   - Agent A = OgaArchitect
   - Agent B = Coding Agent
2. Pick/create repo and verify GitHub auth is valid.
3. OgaArchitect captures requirements and writes 1 epic + 3–5 tasks as GitHub issues.
4. OgaArchitect requests architecture approval checkpoint.
5. OgaArchitect assigns exactly 1 task to Coding Agent.
6. Coding Agent implements, opens PR, links issue, adds test evidence.
7. OgaArchitect/human reviews and merges if gate criteria pass.
8. Close issue with PR/commit evidence and update project state.

## 7) Confirm healthy operating state

- No orphaned blocked tasks without owner
- PRs linked to issue acceptance criteria
- Project board reflects issue stage state

---

## Next docs

- `docs/install.md` — full requirements, permissions, setup
- `docs/cli-walkthrough.md` — command-by-command operator walkthrough
