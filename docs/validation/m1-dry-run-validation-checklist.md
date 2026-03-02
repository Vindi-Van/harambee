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
- [x] Workflow states in Project v2 are mapped via automation artifacts **and validated in a live run**.
  - Added: `.github/workflows/projectv2-governance-sync.yml`, `scripts/projectv2_sync.sh`, `docs/governance/project-v2-automation.md`
  - Evidence: live sample issue [#77](https://github.com/Vindi-Van/harambee/issues/77) moved Intake → Execution → Verification → Done with Project v2 status updates (`Todo` → `In progress` → `In progress` → `Done`) captured in `docs/validation/artifacts/m1-projectv2-live-validation-2026-03-02.txt`.
  - Access check: `gh auth status` shows token scope includes `project`; project/field/option repo variables are now set.
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

## Live Project v2 Validation (2026-03-02)

Sample issue:
- [#77](https://github.com/Vindi-Van/harambee/issues/77) — `M1 Project v2 live validation sample (2026-03-02)`

Project target:
- <https://github.com/users/Vindi-Van/projects/3>

Executed transitions + observed project status:
- Intake (`stage:intake`) -> `Todo`
- Execution (`stage:execution`) -> `In progress`
- Verification (`stage:verification`) -> `In progress`
- Done (issue closed / `status:done`) -> `Done`

Command/output evidence:
- Full command transcript: `docs/validation/artifacts/m1-projectv2-live-validation-2026-03-02.txt`
- Key sync outputs recorded:
  - `synced Vindi-Van/harambee#77 -> intake (option f75ad846)`
  - `synced Vindi-Van/harambee#77 -> execution (option 47fc9ee4)`
  - `synced Vindi-Van/harambee#77 -> verification (option 47fc9ee4)`
  - `synced Vindi-Van/harambee#77 -> done (option 98236657)`

Note on current project schema:
- Project #3 currently exposes 3 status options (`Todo`, `In progress`, `Done`) rather than the full governance state set.
- Repo variable mapping therefore compresses governance stages into this 3-state model for live enforcement.

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
1. (Optional hardening, manual UI-only) Create dedicated discussion categories for dispatch/standup/escalation to remove semantic ambiguity. API provisioning is currently unavailable; fallback mapping is enforced in templates (see `docs/validation/artifacts/m1-discussion-category-hardening-2026-03-02.md`).
2. (Optional hardening) Expand Project v2 Status field options to full governance granularity (Intake/Design/Review Gate/Decomposition/Execution/Verification/Deployment/Blocked/Done) to remove compressed 3-state mapping.

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
  - Optional (manual UI-only): create dedicated GitHub Discussions categories for dispatch/standup/escalation if maintainers want category-level isolation beyond template-enforced fallback mapping.
  - Optional: expand Project v2 Status field options for full governance-state fidelity (currently validated with compressed 3-state mapping).
- Recommendation: M1 exit **GO**
  - Issue-template lifecycle criterion is satisfied.
  - Discussion live-post validation is satisfied (3/3 templates posted and linked).
