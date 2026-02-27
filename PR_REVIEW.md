# PR Review Findings

## Summary
- **Logic Errors Found:** Yes (3 major issues)
- **Performance Issues:** Yes (Unnecessary API calls)
- **Styling Issues:** None
- **iPad Air Stability:** Verified Safe (No UI changes)

## Detailed Findings

### 1. Logic Error: Unnecessary API Calls in `GitHubAssignmentHandler`
**File:** `packages/oga/src/execution/github/githubAssignmentHandler.ts`
**Severity:** Medium (Performance/Rate Limits)

The `handle` method unconditionally invokes `client.addAssignees` and `client.addLabels` without checking if the respective arrays in `this.context` are empty. This results in unnecessary API calls.

**Recommendation:**
Add a guard check before these calls:
```typescript
if (this.context.assignees.length > 0) {
  await executeWithRetry(...)
}
```

### 2. Logic Error: Ineffective Idempotency in `createGitHubExecutionDispatcher`
**File:** `packages/oga/src/execution/github/createGitHubExecutionDispatcher.ts`
**Severity:** Critical (Data Integrity)

The factory function instantiates new `GitHubAssignmentHandler` and `GitHubTransitionHandler` instances on every call. Since these handlers default to a new `InMemoryIdempotencyStore` when one isn't provided in the context, every dispatcher created has its own isolated store. This makes idempotency checks ineffective across requests.

**Recommendation:**
Refactor the runtime bindings to instantiate a singleton `IdempotencyStore` and inject it into the `GitHubExecutionContext`.

### 3. Logic Error: Retry Policy Jitter Can Exceed Max Delay
**File:** `packages/oga/src/execution/retryPolicy.ts`
**Severity:** Low (Timing accuracy)

The jitter calculation logic allows the final delay to exceed `maxDelayMs`.
```typescript
const capped = Math.min(rawDelay, policy.maxDelayMs);
const jitter = capped * policy.jitterRatio;
const randomized = capped - jitter + Math.random() * (jitter * 2);
```
If `capped` equals `maxDelayMs`, `randomized` can be up to `maxDelayMs + jitter`.

**Recommendation:**
Clamp the final `randomized` value to `policy.maxDelayMs`.
