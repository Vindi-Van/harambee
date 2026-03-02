# M1 Exit Dry-Run Validation Checklist

Purpose: satisfy the M1 exit criterion by executing one real dry-run issue per required template type and recording objective evidence.

Reference: `docs/milestones.md` → M1 exit criterion: _"dry-run of one sample task through full lifecycle"_.

## Scope Executed (2026-03-02)

Template types executed in this run:
- `task` (`.github/ISSUE_TEMPLATE/task.yml`) → Issue #58
- `bug` (`.github/ISSUE_TEMPLATE/bug.yml`) → Issue #59
- `design request` (`.github/ISSUE_TEMPLATE/design-request.yml`) → Issue #60
- `blocker` (`.github/ISSUE_TEMPLATE/blocker.yml`) → Issue #61

Discussion-template path addressed in this run:
- Added `.github/DISCUSSION_TEMPLATE/dispatch.yml`
- Added `.github/DISCUSSION_TEMPLATE/standup.yml`
- Added `.github/DISCUSSION_TEMPLATE/escalation.yml`
- Added `.github/DISCUSSION_TEMPLATE/config.yml`
- Added usage protocol: `docs/protocols/discussion-template-usage.md`

---

## Preflight Checks

- [x] Labels in `docs/governance/labels.md` are now available in repo labels.
  - Evidence: labels created via `gh label create` set (all governance families present).
- [ ] Workflow states in Project v2 are mapped (still pending; out of this run’s scope).
- [x] Transition gate requirements from `docs/governance/transition-gates.md` were used as dry-run gate reference.

---

## Dry-Run Sample Matrix (One Sample per Required Template)

| Template | Sample Issue | Initial Labels Verified | Required Fields Complete | Lifecycle Path Executed | Evidence Collected | Result |
| --- | --- | --- | --- | --- | --- | --- |
| Task | [#58](https://github.com/Vindi-Van/harambee/issues/58) | ✅ (`stage:intake`, `status:ready`, `type:task`, `priority:p2`) | ✅ | intake → execution → verification → done/closed | Issue timeline + comments + close note | PASS |
| Bug | [#59](https://github.com/Vindi-Van/harambee/issues/59) | ✅ (`stage:intake`, `status:ready`, `type:bug`, `priority:p1`) | ✅ | intake → execution → verification → done/closed | Issue timeline + close note | PASS |
| Design Request | [#60](https://github.com/Vindi-Van/harambee/issues/60) | ✅ (`stage:design`, `status:ready`, `type:design`, `priority:p2`) | ✅ | design → review-gate → execution → verification → done/closed | Issue timeline + close note | PASS |
| Blocker | [#61](https://github.com/Vindi-Van/harambee/issues/61) | ✅ (`status:blocked`, `type:blocker`, `priority:p0`) | ✅ | blocked raised → unblock decision → execution → verification → done/closed | Issue timeline + unblock comment + close note | PASS |

Notes:
- GitHub CLI form parity limitation: issue forms were represented with equivalent required sections in body text; labels/states were validated through explicit transitions in issue timelines.
- Stage naming follows current M1 state labels (`stage:*`) as documented in governance.

---

## Discussion Template Usage Path Validation

Current repo/API status observed during run:
- `has_discussions=false` for repo (`gh api repos/Vindi-Van/harambee`)

### Gap Checklist
- [x] Confirm desired categories and usage intent represented:
  - [x] dispatch
  - [x] standup
  - [x] escalation
- [x] Define minimum required fields for each discussion template.
- [x] Add template files under `.github/DISCUSSION_TEMPLATE/`.
- [ ] Validate one sample discussion post per template (blocked by Discussions disabled).
- [x] Record pass/fail and follow-up action.

Follow-up action required:
1. Enable GitHub Discussions in repository settings.
2. Create/verify category mapping and post one sample discussion per template.

Interim replacement workflow (documented):
- Use issue/discussion fallback protocol in `docs/protocols/discussion-template-usage.md` until Discussions is enabled.

---

## Completion Summary

- Dry-run date: 2026-03-02
- Validator: @matrim-mastermind
- Samples executed: 4/4 required issue templates
- Pass count: 4
- Fail count: 0 (issue templates); 1 pending validation item (discussion live-post verification)
- Open follow-ups:
  - Enable and wire GitHub Discussions categories to complete live discussion-post validation.
  - Map workflow states into Project v2 automation.
- Recommendation: M1 exit **CONDITIONAL GO**
  - GO for issue-template lifecycle criterion.
  - Final closeout depends on discussion enablement decision/validation per documented path.
