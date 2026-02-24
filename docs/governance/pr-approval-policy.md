# PR Approval Policy (v1)

## Independent Review Rule
- PR authoring Coding Agent cannot be the sole approver.
- Reviewer Worker and/or OgaArchitect must review.

## Human Approval Modes

### Mode A: All PRs require human approval
```yaml
allPrsRequireHumanApproval: true
criticalPrsRequireHumanApproval: false
```

### Mode B: Critical PRs require human approval only
```yaml
allPrsRequireHumanApproval: false
criticalPrsRequireHumanApproval: true
criticality:
  complexityThreshold: 4
  labels:
    - critical-change
    - security
    - data-migration
```

## Merge Gates
A PR is merge-eligible when:
1. required tests pass
2. independent reviewer decision is approval
3. policy-required human approval exists
4. linked issue transition criteria are satisfied

## Return Path
If review fails:
- PR marked changes-requested
- issue gets `status:qa-return` or review-return label
- assigned worker enters reserved fix window until resolution
