# M5 Starter Kit — Reusable Template (Bootstrap)

This template is the minimum portable package a second team can copy into a new repository and start operating with Harambee in less than one day.

## 1) Template Package (copy as-is)

- `.github/ISSUE_TEMPLATE/task.yml`
- `.github/ISSUE_TEMPLATE/bug.yml`
- `.github/ISSUE_TEMPLATE/design-request.yml`
- `.github/ISSUE_TEMPLATE/blocker.yml`
- `.github/DISCUSSION_TEMPLATE/config.yml`
- `.github/DISCUSSION_TEMPLATE/dispatch.yml`
- `.github/DISCUSSION_TEMPLATE/standup.yml`
- `.github/DISCUSSION_TEMPLATE/escalation.yml`
- `.github/workflows/projectv2-governance-sync.yml`
- `scripts/projectv2_sync.sh`
- `docs/governance/*`
- `docs/protocols/assignment-flow.md`
- `docs/protocols/discussion-template-usage.md`
- `docs/contracts/*`

## 2) Repo Bootstrap Checklist

Use this checklist when creating a fresh project from the starter kit.

### A. Governance and Workflow
- [ ] Create required labels from `docs/governance/labels.md`
- [ ] Enable GitHub Discussions
- [ ] Add Project v2 board with governance status field
- [ ] Set repository variables consumed by `projectv2_sync.sh`
- [ ] Validate `projectv2-governance-sync` workflow runs on issue updates

### B. Roles and Contracts
- [ ] Confirm OgaArchitect owner and backup owner
- [ ] Confirm UI, Coding, Reviewer, QA, DevOps role assignees
- [ ] Publish role contract links in README or project onboarding note

### C. Operations Readiness
- [ ] Run a dry-run lifecycle issue (Intake -> Execution -> Verification -> Done)
- [ ] Run one dispatch discussion + one standup discussion
- [ ] Run `npm run check` in repository root

## 3) Required Local Customization Points

Replace these values before first production use:

- Project v2 IDs and status option IDs in repo variables
- Team-specific escalation contacts and SLA windows
- Repo-specific coding standards and release/rollback owners

## 4) Definition of "Starter Kit Ready"

A repository is starter-kit ready when:

1. Templates and governance docs are present.
2. Project sync automation maps issue labels/states into Project v2.
3. At least one dry-run issue successfully completes lifecycle with evidence.
4. Role ownership and handoff expectations are explicitly documented.
