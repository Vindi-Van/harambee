# M1 Exit Dry-Run Validation Checklist

Purpose: satisfy the M1 exit criterion by defining a dry-run validation for one sample issue per template type, plus explicit handling of the discussion-template gap.

Reference: `docs/milestones.md` → M1 exit criterion: _"dry-run of one sample task through full lifecycle"_.

## Scope

Template types covered in this dry-run package:
- `task` (`.github/ISSUE_TEMPLATE/task.yml`)
- `bug` (`.github/ISSUE_TEMPLATE/bug.yml`)
- `design request` (`.github/ISSUE_TEMPLATE/design-request.yml`)
- `blocker` (`.github/ISSUE_TEMPLATE/blocker.yml`)
- (existing non-M1 template) `qa-return` (`.github/ISSUE_TEMPLATE/qa-return.yml`)

Discussion-template gap to validate:
- `dispatch` discussion template (missing)
- `standup` discussion template (missing)
- `escalation` discussion template (missing)

---

## Preflight Checks

- [ ] Labels in `docs/governance/labels.md` are available in repo labels.
- [ ] Workflow states in `docs/governance/states.md` are mapped in Project v2 (or documented as pending).
- [ ] Transition gate requirements from `docs/governance/transition-gates.md` are known to reviewer.

---

## Dry-Run Sample Matrix (One Sample per Template Type)

| Template | Sample Issue | Initial Labels Verified | Required Fields Complete | Lifecycle Path (planned) | Evidence Collected | Result |
| --- | --- | --- | --- | --- | --- | --- |
| Task | TBD (#____) | [ ] | [ ] | intake → planning → execution → verification → done | [ ] | PASS / FAIL |
| Bug | TBD (#____) | [ ] | [ ] | intake → planning → execution → verification → done | [ ] | PASS / FAIL |
| Design Request | TBD (#____) | [ ] | [ ] | design/review → planning → execution or closure | [ ] | PASS / FAIL |
| Blocker | TBD (#____) | [ ] | [ ] | blocked raised → unblock decision/action → resumed state | [ ] | PASS / FAIL |
| QA Return (gap-support) | TBD (#____) | [ ] | [ ] | verification failure → execution re-entry → verification pass | [ ] | PASS / FAIL |

Minimum evidence per sample:
- Issue link and final state
- Label/state transitions captured (timeline or screenshots)
- Artifact links as required by gate (PR/test/report/checklist)
- Closure note summarizing whether template guided execution correctly

---

## Per-Sample Checklist

Use for each sample issue above.

- [ ] Template default labels applied correctly on issue creation.
- [ ] Required fields were sufficient and not ambiguous.
- [ ] Stage/status labels updated without singleton-family conflicts.
- [ ] Gate artifacts attached before advancing states.
- [ ] Verification step recorded explicit pass/fail.
- [ ] If failed, return path (QA return / blocker) worked and was documented.
- [ ] Final state + closure reason captured.

---

## Discussion Template Gap Validation

Current repo status: no `.github/DISCUSSION_TEMPLATE/*` files found.

### Gap Checklist
- [ ] Confirm desired categories and usage intent:
  - [ ] dispatch
  - [ ] standup
  - [ ] escalation
- [ ] Define minimum required fields for each discussion template.
- [ ] Add template files under `.github/DISCUSSION_TEMPLATE/` (or explicitly defer with rationale).
- [ ] Validate one sample discussion post per template or approved substitute process.
- [ ] Record pass/fail and follow-up actions.

### Exit Decision Rule for Gap
M1 validation can be marked complete only when one of the following is true:
1. Discussion templates are added and sample-post validated, **or**
2. Maintainers explicitly decide discussion templates are out of scope for M1 and document replacement workflow in `docs/protocols/`.

---

## Completion Summary (to fill after execution)

- Dry-run date:
- Validator(s):
- Samples executed:
- Pass count:
- Fail count:
- Open follow-ups:
- Recommendation: M1 exit **GO / NO-GO**
