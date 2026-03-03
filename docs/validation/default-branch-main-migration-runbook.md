# Default Branch Migration Runbook (`master` -> `main`)

Date: 2026-03-02  
Status: Ready for maintainers (manual GitHub UI step required)

## Purpose
Provide a minimal, repeatable runbook for switching a repository default branch to `main` and validating the repository state after the switch.

## Scope
- Canonical default branch should be `main`.
- Actual default-branch switch in GitHub is a **maintainer/admin UI action**.
- This runbook captures both UI and CLI verification steps.

## 1) Pre-checks (CLI)
Run before touching settings:

```bash
gh repo view Vindi-Van/harambee --json nameWithOwner,defaultBranchRef --jq '{repo: .nameWithOwner, defaultBranch: .defaultBranchRef.name}'
git remote show origin
```

Expected before migration in legacy repos: default branch may still be `master`.

## 2) Local branch canonicalization (if needed)
If the local branch is still `master`, rename and push:

```bash
git checkout master
git branch -m main
git push -u origin main
```

If local already uses `main`, skip this step.

## 3) Manual GitHub UI switch (required)
1. Open repo: `https://github.com/Vindi-Van/harambee`
2. Go to **Settings** -> **Branches**.
3. In **Default branch**, click the edit/switch control.
4. Choose `main`.
5. Confirm the warning dialog to update default branch.

If branch protection rules target the old branch name, update them to apply to `main`.

## 4) Post-switch verification (CLI)
Run all checks:

```bash
# Canonical default branch check
gh repo view Vindi-Van/harambee --json defaultBranchRef --jq '.defaultBranchRef.name'

# Remote head should point to main
git remote show origin | sed -n '/HEAD branch/s/.*: //p'

# Ensure main exists remotely
git ls-remote --heads origin main

# Sanity-check PR base expectation
gh pr list --repo Vindi-Van/harambee --state open --json number,title,baseRefName --jq '.[] | {number, title, base: .baseRefName}'
```

Expected:
- `defaultBranchRef.name` = `main`
- remote HEAD branch = `main`
- `refs/heads/main` exists
- open PRs target `main` unless intentionally overridden

## 5) Optional cleanup
After confirming no automation depends on `master`:

```bash
git push origin --delete master
```

Only do this when maintainers confirm the old branch is no longer required.

## Notes
- For freshly initialized repos, avoid `master` entirely by starting on `main` from first push.
- This runbook is the canonical reference for manual default-branch migration in optional hardening follow-ups.
