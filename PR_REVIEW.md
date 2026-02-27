# PR Review Findings

## Critical Logic Errors

### `packages/oga/src/execution/github/githubAssignmentHandler.ts`

**Line 104-120:** The `addAssignees` and `addLabels` methods are called without checking if the respective lists are empty.
*   **Recommendation:** Wrap these calls in a check for `this.context.assignees.length > 0` and `this.context.labels.length > 0`.

### `packages/oga/src/types.ts`

**Line 49:** The `TransitionRequest` interface is missing the `labels` property.
*   **Impact:** Prevents policy guards from accessing issue labels for criticality checks.
*   **Recommendation:** Add `labels: string[]` to the `TransitionRequest` interface.

### `packages/oga/src/policyGuards.ts`

**Line 75:** The `requiresHumanApprovalForPr` function does not check for critical labels defined in the policy.
*   **Impact:** Critical PRs labeled with `critical-change`, `security`, etc., may bypass human approval if complexity is low.
*   **Recommendation:** Add a check: `if (request.labels.some(label => policy.approval.criticality.labels.includes(label))) return true;`.

### `packages/oga/src/execution/retryPolicy.ts`

**Line 39:** The jitter calculation allows the final delay to exceed `maxDelayMs`.
*   **Current Logic:** `randomized = capped - jitter + Math.random() * (jitter * 2)` where `jitter` is a fraction of `capped`. Max value is `capped * (1 + jitterRatio)`.
*   **Recommendation:** Clamp the result: `Math.min(Math.floor(randomized), policy.maxDelayMs)`.

### `packages/oga/src/execution/github/createGitHubExecutionDispatcher.ts`

**Line 22:** The factory creates new handler instances on every call, and `GitHubAssignmentHandler`/`GitHubTransitionHandler` default to `InMemoryIdempotencyStore`.
*   **Impact:** In the default per-request usage pattern (e.g., `runtimeBindings.ts`), this results in no effective deduplication across requests.
*   **Recommendation:** Inject a shared `IdempotencyStore` (e.g., Redis-backed) into the context or allow the factory to accept one.

## Stylistic and Best Practices

### `packages/oga/src/execution/github/githubAssignmentHandler.ts` & `githubTransitionHandler.ts`

**Method `shouldSkipComment`:** The fail-open strategy (returning `false` on error) combined with retries on `createComment` can lead to duplicate comments if the `hasRequestComment` check fails transiently.
*   **Recommendation:** Consider a fail-closed or more robust idempotency check, or rely on the `idempotencyStore` for this aspect as well.

## iPad Air Layout Stability

*   **Status:** Not Applicable.
*   **Note:** The changes are backend-only (package `@harambee/oga`) and do not include any UI components or React Native code. No iPad Air layout regressions are possible from this changeset.
