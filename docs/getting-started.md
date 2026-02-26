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

1. Clone repo and install deps
2. Ensure GitHub auth is working (`gh auth status`)
3. Create baseline labels/project workflow in GitHub (if not already present)
4. Run first assignment flow using issue comments
5. Validate PR + review + merge loop

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

## 5) Confirm healthy operating state

- No orphaned blocked tasks without owner
- PRs linked to issue acceptance criteria
- Project board reflects issue stage state

---

## Next docs

- `docs/install.md` — full requirements, permissions, setup
- `docs/cli-walkthrough.md` — command-by-command operator walkthrough
