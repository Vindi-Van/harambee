# Harambee Installation & Requirements

## 1) Runtime requirements

### Required
- Git
- Node.js 22+
- npm 10+
- GitHub CLI (`gh`)
- Access to a GitHub repo where Harambee state is managed

### Optional (recommended)
- OpenClaw instance for agent orchestration and messaging
- Redis (if enabling lease/heartbeat coordination or future durable adapters)

## 2) Accounts and permissions

## GitHub requirements

Harambee operations write to GitHub (issues, PRs, comments, labels, project updates), so authenticated GitHub access is a hard prerequisite.

At minimum, operator credentials/bot token should be able to:
- read/write Issues
- read/write PRs and review comments
- read/write labels
- read/write Project fields (if using Projects for stage state)
- read/write Discussions

**Repository setting requirement:** GitHub Discussions must be enabled for full Harambee capability (dispatch, standup, escalation discussion workflows). Verify with:
- REST: `has_discussions=true`
- GraphQL: `hasDiscussionsEnabled=true`

If using branch protection and required checks:
- ensure bot/user has permissions compatible with merge policy.

## OpenClaw permissions (if used)

OpenClaw must have access to:
- GitHub operations (via `gh` auth in runtime context)
- optional messaging surfaces (Telegram/Slack/etc.) for escalations
- optional sub-agent spawning if a single instance plays multiple roles

## 3) Distribution model (today vs future)

### Today (recommended)
- Clone the GitHub repo and run from source.
- Why: Harambee is currently workflow/framework-first, and GitHub is the canonical state plane.
- This is the best current distribution mode for operators.

### Future option
- Publish a dedicated npm package/CLI once command surface is stabilized (e.g., `harambee init`, `harambee assign`, `harambee run`).
- Packaging is feasible, but source-distribution is currently the canonical path.

## 4) Repo setup

```bash
git clone https://github.com/Vindi-Van/harambee.git
cd harambee
npm install
npm run check
```

## 5) Governance bootstrap checklist

Before running production-like orchestration:
- [ ] Labels created per `docs/governance/labels.md`
- [ ] Workflow states aligned with `docs/governance/states.md`
- [ ] Transition gates configured from `docs/governance/transition-gates.md`
- [ ] PR policy aligned with `docs/governance/pr-approval-policy.md`
- [ ] Role contracts acknowledged in `docs/contracts/`

## 6) Does a GitHub Project need to exist?

**Yes for full Harambee operation.**

- Minimal mode can run on Issues + labels + PRs only, but this is limited and not the target operating mode.
- Full mode requires a GitHub Project v2 to track stage/status state and support automation.

For production multi-agent operation, treat Project v2 as a hard requirement.

### Access requirement (hard)
Agents/operators must have access to **both**:
1. the repository (`repo` operations), and
2. the GitHub Project (`read:project` + `project` scopes for read/write state sync).

## 7) Can one OpenClaw instance play 2+ roles using subagents?

**Yes.**

Pattern:
- Main session acts as OgaArchitect
- Spawn subagents as role workers (Coding Agent, QA Agent, Reviewer Worker)
- Keep role prompts/contracts isolated per subagent
- Route all durable state updates back to GitHub (canonical)

Guardrails:
- Avoid one subagent holding multiple conflicting roles in the same task path
- Keep assignment authority centralized in OgaArchitect flow
- Preserve artifact-linked handoffs between roles

## 8) Security baseline

- Principle of least privilege for tokens
- Separate bot identities when possible (or separate role labels/scopes)
- Require human approval on critical PRs (configurable policy)
- Ensure off-GitHub decisions are summarized back to Issues/PRs
