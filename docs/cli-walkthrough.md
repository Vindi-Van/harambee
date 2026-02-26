# Harambee CLI Walkthrough (Day-0 / Day-1)

This walkthrough uses:
- `gh` (GitHub CLI) for canonical workflow actions
- optional `openclaw` commands for runtime orchestration checks

> Harambee itself is a framework/process layer. Its operational CLI today is primarily GitHub CLI + OpenClaw runtime commands.

---

## A) Operator CLI options you will use most

### GitHub CLI (`gh`)
- Auth/context: `gh auth status`, `gh repo view`
- Issues: `gh issue list/view/create/edit/comment/close`
- PRs: `gh pr list/view/create/checks/merge`
- Review comments: `gh api repos/<owner>/<repo>/pulls/<n>/comments`
- Labels/projects/discussions: via `gh` subcommands or `gh api`

### OpenClaw CLI (optional, if using OpenClaw-managed agents)
- Runtime/service: `openclaw gateway status|start|stop|restart`
- Overall health: `openclaw status`

---

## B) Day-0 setup checks

```bash
# 1) Repo + deps
git clone https://github.com/Vindi-Van/harambee.git
cd harambee
npm install
npm run check

# 2) GitHub auth
gh auth status
gh repo view Vindi-Van/harambee

# 3) OpenClaw health (optional)
openclaw gateway status
openclaw status
```

Expected:
- checks pass
- GitHub auth is valid
- OpenClaw healthy if in use

---

## C) Day-1 operating loop (single task)

### Step 1: pick or create issue

```bash
gh issue list --repo Vindi-Van/harambee --state open
gh issue create --repo Vindi-Van/harambee --title "<task>" --body "<acceptance criteria>"
```

### Step 2: assignment signal (protocol)

Use readiness/assignment format from `docs/protocols/assignment-flow.md`.

### Step 3: execute work and open PR

```bash
git checkout -b feat/<task-slug>
# implement changes
npm run check
git add .
git commit -m "feat: <summary>"
git push -u origin feat/<task-slug>
gh pr create --repo Vindi-Van/harambee --base main --head feat/<task-slug> --title "feat: <summary>" --body "<what/why/tests>"
```

### Step 4: review + checks

```bash
gh pr checks <pr-number> --watch --interval 5
gh pr view <pr-number> --comments
```

### Step 5: merge

```bash
gh pr merge <pr-number> --squash --delete-branch
```

### Step 6: close issue with evidence

```bash
gh issue comment <issue-number> --body "Completed via PR #<n> (<sha>)"
gh issue close <issue-number>
```

---

## D) Troubleshooting quick hits

- `gh` auth failures:
  - run `gh auth status`
  - re-authenticate in runtime where command executes
- stale project tracking:
  - update issue state + labels + project field in same cycle as merge
- malformed batched PR replies:
  - lint for malformed fragments and correct immediately (see local tool hygiene notes)

---

## E) Role model with one OpenClaw instance

Yes, one OpenClaw instance can run multiple Harambee roles via subagents:
- main session = OgaArchitect
- spawned subagents = Coding/QA/Reviewer roles

Best practice:
- one role per subagent per task path
- keep role prompts/contracts isolated
- push every durable decision/status change back into GitHub
