# PR Review Findings

## Critical

*   **Durable Idempotency**: `createGitHubExecutionDispatcher` (in `createGitHubExecutionDispatcher.ts`) creates new `GitHubAssignmentHandler` and `GitHubTransitionHandler` instances on every call. These handlers instantiate a *new* `InMemoryIdempotencyStore` if one isn't provided in the context. Since `processAssignmentWithGitHub` and `processTransitionWithGitHub` (in `runtimeBindings.ts`) call `createGitHubExecutionDispatcher` directly without passing a shared store, each request gets a fresh in-memory store. This means idempotency is only effective within the scope of a single request processing (which is trivial) and does not persist across different runtime invocations or server restarts. This defeats the purpose of "durable" idempotency mentioned in the commit messages.

## Major

*   **Unnecessary API Calls**:
    *   `GitHubAssignmentHandler` (in `githubAssignmentHandler.ts`):
        ```typescript
        await this.client.addAssignees({ ...issueRef, assignees: this.context.assignees });
        await this.client.addLabels({ ...issueRef, labels: this.context.labels });
        ```
        It does not check if `this.context.assignees` or `this.context.labels` are empty before making the API calls. This results in wasted API calls if these arrays are empty.

## Minor

*   **Retry Policy Jitter**: In `packages/oga/src/execution/retryPolicy.ts`, the jitter calculation is:
    ```typescript
    const capped = Math.min(rawDelay, policy.maxDelayMs);
    const jitter = capped * policy.jitterRatio;
    const randomized = capped - jitter + Math.random() * (jitter * 2);
    ```
    If `capped` is `maxDelayMs`, then `randomized` can range from `maxDelayMs - jitter` to `maxDelayMs + jitter`. This means the delay can exceed `policy.maxDelayMs`. While not catastrophic, it violates the semantic of a "maximum delay".

*   **Fail-Open Comment Checks**: Both handlers have a `shouldSkipComment` method:
    ```typescript
    try {
      // ... check comment existence ...
    } catch {
      // Fail-open: if comment lookup fails, continue and attempt createComment.
      return false;
    }
    ```
    If GitHub is having issues or rate limiting reads, this fail-open strategy will cause the system to attempt to create a comment anyway. If the write succeeds but the read failed (e.g. eventual consistency or partial outage), this could lead to duplicate comments (spam).

## Note

*   **iPad Air layout stability**: No UI components were found in this PR, so no iPad/Flexbox constraints were violated.
