# Label Taxonomy (Milestone 1)

This taxonomy is optimized for GitHub Projects v2 and rule-based automation.

## Stage Labels (exactly one)
- `stage:intake`
- `stage:design`
- `stage:review-gate`
- `stage:decomposition`
- `stage:execution`
- `stage:verification`
- `stage:deployment`

## Type Labels (exactly one)
- `type:task`
- `type:bug`
- `type:design`
- `type:blocker`

## Role Labels (owner / active executor)
- `role:oga-architect`
- `role:ui`
- `role:dev`
- `role:reviewer`
- `role:qa`
- `role:devops`

## Complexity Labels (zero or one during intake/design; required by decomposition)
- `complexity:1`
- `complexity:2`
- `complexity:3`
- `complexity:4`
- `complexity:5`

## Status/Control Labels (exactly one primary status)
- `status:ready`
- `status:in-progress`
- `status:waiting-review`
- `status:qa-return`
- `status:blocked`
- `status:done`

## Priority Labels (exactly one)
- `priority:p0`
- `priority:p1`
- `priority:p2`
- `priority:p3`

## Governance Labels (optional overlays)
- `human-approval:required`
- `human-approval:critical-only`
- `critical-change`
- `artifact:missing`
- `needs-decomposition`

## Guardrails
- Keep one-and-only-one label in each singleton family (`stage:*`, `type:*`, `priority:*`, primary `status:*`).
- `type:blocker` should normally carry `status:blocked` and `priority:p0`.
- `status:qa-return` is only valid when `stage:execution` is active.
- Missing required artifacts must add `artifact:missing` and block forward transition.
