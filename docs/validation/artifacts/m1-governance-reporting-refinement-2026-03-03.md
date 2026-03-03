# M1 Governance Reporting Refinement (2026-03-03)

## Change
Added two additive fields to `sync_report` emitted by `scripts/projectv2_sync.sh`:

- `issue_state` (`open|closed`) — raw GitHub issue state observed during sync.
- `selection_reason` — the exact precedence rule that won when deriving `governance_key`.

This is a no-behavior-change reporting refinement: project field writes are unchanged.

## Why
When `governance_key=done` is emitted, operators can now distinguish whether it came from:

- issue closure (`selection_reason=state:closed`),
- an explicit label (`selection_reason=label:status:done`), or
- default fallback (`selection_reason=default:intake` for intake path).

That reduces ambiguity during triage/replay without increasing automation complexity.

## Validation Notes

- Syntax check passed:
  - `bash -n scripts/projectv2_sync.sh`
- Output contract check passed:
  - `grep -n "issue_state=\${state}" scripts/projectv2_sync.sh`
  - `grep -n "selection_reason=\${selection_reason}" scripts/projectv2_sync.sh`

## Expected `sync_report` shape

```text
sync_report repo=<owner/repo> issue=<n> issue_state=<open|closed> governance_key=<intake|...|done|blocked> selection_reason=<state:closed|label:...|default:intake> status_field_id=<field-id> status_option_id=<option-id> gov_field_updated=<true|false> gov_field_id=<field-id|unset> gov_option_id=<option-id|unset>
```
