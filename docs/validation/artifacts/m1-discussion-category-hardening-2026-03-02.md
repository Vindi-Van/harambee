# M1 Optional Hardening: Discussion Category Provisioning Attempt (2026-03-02)

## Goal
Create dedicated GitHub Discussion categories for:
- Dispatch
- Standup
- Escalation

Repository: `Vindi-Van/harambee`

## Validation Commands + Results

### 1) Verify current discussion categories
```bash
gh api graphql -f query='query($owner:String!, $name:String!){ repository(owner:$owner, name:$name){ id name discussionCategories(first:20){ nodes { id name slug emoji isAnswerable } } } }' -f owner='Vindi-Van' -f name='harambee'
```

Result (existing defaults only):
- Announcements
- General
- Ideas
- Polls
- Q&A
- Show and tell

### 2) Attempt category creation via GraphQL mutation
```bash
gh api graphql -f query='mutation($repoId:ID!, $name:String!, $emoji:String!, $description:String!, $isAnswerable:Boolean!){ createDiscussionCategory(input:{repositoryId:$repoId,name:$name,emoji:$emoji,description:$description,isAnswerable:$isAnswerable}) { discussionCategory { id name slug } } }' -f repoId='R_kgDORXlmkA' -f name='Dispatch' -f emoji=':triangular_flag_on_post:' -f description='Assignment kickoff and routing discussions' -F isAnswerable=false
```

Error:
- `Field 'createDiscussionCategory' doesn't exist on type 'Mutation'`

## Blocker Assessment
Dedicated Discussion category creation is **not available through GitHub public GraphQL mutation surface** used by `gh api` (no `createDiscussionCategory` mutation).

Given this API limitation, the hardening item is implemented via explicit fallback category mapping in templates + protocol docs.

## Implemented Fallback (Validated)
1. Added explicit category binding in discussion templates:
   - `.github/DISCUSSION_TEMPLATE/dispatch.yml` → `category: "General"`
   - `.github/DISCUSSION_TEMPLATE/standup.yml` → `category: "Show and tell"`
   - `.github/DISCUSSION_TEMPLATE/escalation.yml` → `category: "Q&A"`
2. Updated protocol documentation to codify mapping and API blocker.
3. Preserved prior live evidence links (#64/#65/#66) that already align with these categories.

## Outcome
- Dedicated categories could not be provisioned programmatically due to GitHub API surface limitation.
- Template-to-category mapping is now explicit, deterministic, and documented, reducing ambiguity without requiring manual UI-only category management.
