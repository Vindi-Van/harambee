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

At minimum, operator credentials/bot token should be able to:
- read/write Issues
- read/write PRs and review comments
- read/write labels
- read/write Project fields (if using Projects for stage state)
- read Discussions (write if using discussions for coordination)

If using branch protection and required checks:
- ensure bot/user has permissions compatible with merge policy.

## OpenClaw permissions (if used)

OpenClaw must have access to:
- GitHub operations (via `gh` auth in runtime context)
- optional messaging surfaces (Telegram/Slack/etc.) for escalations
- optional sub-agent spawning if a single instance plays multiple roles

## 3) Repo setup

```bash
git clone https://github.com/Vindi-Van/harambee.git
cd harambee
npm install
npm run check
```

## 4) Governance bootstrap checklist

Before running production-like orchestration:
- [ ] Labels created per `docs/governance/labels.md`
- [ ] Workflow states aligned with `docs/governance/states.md`
- [ ] Transition gates configured from `docs/governance/transition-gates.md`
- [ ] PR policy aligned with `docs/governance/pr-approval-policy.md`
- [ ] Role contracts acknowledged in `docs/contracts/`

## 5) Does a GitHub Project need to exist?

**Recommended, not strictly mandatory** for minimal operation.

- Minimal mode: Issues + labels + PRs only
- Full mode (recommended): GitHub Project/Kanban tracks stage state and improves visibility/coordination

If running multiple agents and parallel tasks, a Project board is strongly advised.

## 6) Can one OpenClaw instance play 2+ roles using subagents?

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

## 7) Security baseline

- Principle of least privilege for tokens
- Separate bot identities when possible (or separate role labels/scopes)
- Require human approval on critical PRs (configurable policy)
- Ensure off-GitHub decisions are summarized back to Issues/PRs
