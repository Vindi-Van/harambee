# Discussion Template Usage Path (M1)

This protocol defines how Harambee uses GitHub Discussion templates for coordination.

## Templates
- `dispatch.yml` → assignment kickoff / intent routing
- `standup.yml` → status cadence updates
- `escalation.yml` → blocked/risk escalation requiring decision

Location: `.github/DISCUSSION_TEMPLATE/`

## Intended Live Path
1. Open **Discussions** in repo.
2. Choose the matching template (dispatch/standup/escalation).
3. Fill required fields and post.
4. Link resulting discussion URL in corresponding issue/PR timeline.
5. Ensure stage/status labels stay aligned with issue state.

## Repository Requirement (Full Capability)
Harambee's full workflow capability depends on GitHub Discussions being enabled.

Required setting state:
- REST: `has_discussions=true`
- GraphQL: `hasDiscussionsEnabled=true`

Verified on 2026-03-02 for `Vindi-Van/harambee`.

## Interim Fallback (only if Discussions is disabled)
- Use issue comments with headings matching the template fields.
- Prefix comments with `[Dispatch]`, `[Standup]`, or `[Escalation]`.
- Link fallback comments in the M1 validation checklist.

## Exit Completion Requirement
To fully close discussion-template validation, maintainers must:
1. Keep Discussions enabled,
2. Create/verify category mapping,
3. Post at least one sample discussion per template type.
