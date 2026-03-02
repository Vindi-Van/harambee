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
- [~] Workflow states in Project v2 are mapped via automation artifacts, but live run evidence is pending project scope/config.
  - Added: `.github/workflows/projectv2-governance-sync.yml`, `scripts/projectv2_sync.sh`, `docs/governance/project-v2-automation.md`
  - Blocker: current local `gh` token lacks `read:project`/`project` scopes; repo vars for project/field/option IDs are unset.
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
- `has_discussions=true` for repo (`gh api repos/Vindi-Van/harambee`)
- `hasDiscussionsEnabled=true` via GraphQL (`gh api graphql` repository query)

### Gap Checklist
- [x] Confirm desired categories and usage intent represented:
  - [x] dispatch
  - [x] standup
  - [x] escalation
- [x] Define minimum required fields for each discussion template.
- [x] Add template files under `.github/DISCUSSION_TEMPLATE/`.
- [x] Validate one sample discussion post per template and record links.
- [x] Record pass/fail and follow-up action.

Live sample discussion evidence:
- Dispatch: <https://github.com/Vindi-Van/harambee/discussions/64> (category: General)
- Standup: <https://github.com/Vindi-Van/harambee/discussions/65> (category: Show and tell)
- Escalation: <https://github.com/Vindi-Van/harambee/discussions/66> (category: Q&A)

Category mapping used for M1 validation:
- dispatch → General
- standup → Show and tell
- escalation → Q&A


Follow-up action required:
1. (Optional hardening) Create dedicated discussion categories for dispatch/standup/escalation to remove semantic ambiguity.
2. Complete live Project v2 validation run after setting project IDs/options + token scopes (see `docs/governance/project-v2-automation.md`).

Interim replacement workflow (documented):
- Use issue/discussion fallback protocol in `docs/protocols/discussion-template-usage.md` only if Discussions is later disabled or unavailable.

---

## Completion Summary

- Dry-run date: 2026-03-02
- Validator: @matrim-mastermind
- Samples executed: 4/4 required issue templates
- Pass count: 4
- Fail count: 0
- Open follow-ups:
  - Optional: create dedicated GitHub Discussions categories for dispatch/standup/escalation.
  - Map workflow states into Project v2 automation.
- Recommendation: M1 exit **GO**
  - Issue-template lifecycle criterion is satisfied.
  - Discussion live-post validation is satisfied (3/3 templates posted and linked).
