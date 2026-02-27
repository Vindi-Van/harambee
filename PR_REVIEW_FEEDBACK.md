## PR Review Feedback

### 1. Logic Error: Unchecked API Calls
*   **File:** `packages/oga/src/execution/github/githubAssignmentHandler.ts` (lines ~106, ~116)
*   **Issue:** The `GitHubAssignmentHandler` calls `client.addAssignees` and `client.addLabels` unconditionally, even if the respective lists in `context` are empty. This results in unnecessary API calls and potential errors.
*   **Recommendation:** Wrap these calls in checks like `if (this.context.assignees.length > 0)` and `if (this.context.labels.length > 0)`, similar to `GitHubTransitionHandler`.

### 2. Logic Error: Retry Policy Jitter Overflow
*   **File:** `packages/oga/src/execution/retryPolicy.ts` (line ~40)
*   **Issue:** The jitter calculation `randomized = capped - jitter + Math.random() * (jitter * 2)` allows the delay to exceed `maxDelayMs` when `capped` equals `maxDelayMs`. Specifically, `randomized` can reach `capped + jitter`.
*   **Recommendation:** Ensure the final delay is clamped to `policy.maxDelayMs`, e.g., `Math.min(policy.maxDelayMs, Math.max(0, Math.floor(randomized)))`.

### 3. Architecture Issue: Ineffective Idempotency
*   **File:** `packages/oga/src/execution/github/createGitHubExecutionDispatcher.ts` & `packages/oga/src/execution/runtimeBindings.ts`
*   **Issue:** `createGitHubExecutionDispatcher` instantiates new handlers on every call. In `runtimeBindings.ts`, this factory is called per-request. Consequently, the default `InMemoryIdempotencyStore` is recreated for every request, rendering it useless for deduplication across requests (it only works within a single request's lifecycle, which is insufficient for preventing double-execution if the same request is retried externally).
*   **Recommendation:** The `IdempotencyStore` must be instantiated outside the request handler scope and passed into `createGitHubExecutionDispatcher` via the `context`.

### 4. Styling & Frontend
*   **iPad Air Layout Stability:** Verified that no frontend code (HTML/CSS/JSX) is present in this PR. The changes are backend-only.
*   **Styling:** Code adheres to standard TypeScript formatting.

### Tests
*   Ran existing tests for `@harambee/oga`. All passed, but coverage is missing for empty list scenarios in `GitHubAssignmentHandler`, which confirms the logic error went undetected.
