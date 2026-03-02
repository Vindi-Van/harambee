# Discussion Template Usage Path (M1)

This protocol defines how Harambee uses GitHub Discussion templates for coordination.

## Templates
- `dispatch.yml` → assignment kickoff / intent routing
- `standup.yml` → status cadence updates
- `escalation.yml` → blocked/risk escalation requiring decision

Location: `.github/DISCUSSION_TEMPLATE/`

## Category Mapping (current enforced fallback)
- `dispatch.yml` → `General`
- `standup.yml` → `Show and tell`
- `escalation.yml` → `Q&A`

These mappings are explicitly declared in each template via `category:` to keep routing deterministic.

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

## Category Provisioning Limitation (GitHub API)
On 2026-03-02, category-creation was attempted via `gh api graphql`.
GitHub returned: `Field 'createDiscussionCategory' doesn't exist on type 'Mutation'`.

Until GitHub exposes a supported API for category creation, dedicated dispatch/standup/escalation categories must be managed manually in the web UI (maintainer action), while Harambee enforces template-level fallback mapping above.

Evidence artifact: `docs/validation/artifacts/m1-discussion-category-hardening-2026-03-02.md`

## Exit Completion Requirement
To fully close discussion-template validation, maintainers must:
1. Keep Discussions enabled,
2. Keep template-to-category mapping validated (or replace with dedicated categories if manually created),
3. Post at least one sample discussion per template type.
