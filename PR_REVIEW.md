# PR Review Feedback

## Summary
The PR introduces foundational GitHub execution handlers but contains critical logic gaps regarding idempotency and retry policies.

## Critical Issues

### 1. Lack of Durable Idempotency
**File:** `packages/oga/src/execution/runtimeBindings.ts`
**Severity:** Critical
**Description:**
The functions `processAssignmentWithGitHub` and `processTransitionWithGitHub` instantiate a new `GitHubExecutionDispatcher` (and thus a new `InMemoryIdempotencyStore`) on every invocation.
```typescript
const dispatcher = createGitHubExecutionDispatcher(context);
```
In a stateless environment (e.g., serverless functions processing webhooks), this means every request has a fresh, empty "seen" cache. The idempotency logic in the handlers will always return `true` (allowed), failing to prevent duplicate processing or replay attacks.
**Recommendation:**
The `GitHubExecutionContext` must allow injecting an external, durable `IdempotencyStore` (e.g., Redis or DB-backed), or the dispatcher lifecycle must be lifted out of the per-request handler.

### 2. Retry Policy Jitter Overflow
**File:** `packages/oga/src/execution/retryPolicy.ts`
**Severity:** Major
**Description:**
The jitter calculation adds randomness *after* capping the delay to `maxDelayMs`.
```typescript
const capped = Math.min(rawDelay, policy.maxDelayMs); // e.g., 5000
const jitter = capped * policy.jitterRatio;           // e.g., 1000
const randomized = capped - jitter + Math.random() * (jitter * 2); // 4000..6000
```
This allows the final delay to exceed the configured `maxDelayMs`.
**Recommendation:**
Clamp the final `delayMs` result: `Math.min(randomized, policy.maxDelayMs)`.

## Logic & Performance

### 3. Unnecessary API Calls
**File:** `packages/oga/src/execution/github/githubAssignmentHandler.ts`
**Severity:** Minor
**Description:**
`addAssignees` is called even if the assignee list is empty.
**Recommendation:**
Wrap the call: `if (this.context.assignees.length > 0) { ... }`.

### 4. Fail-Open Comment Checks
**File:** `packages/oga/src/execution/github/githubAssignmentHandler.ts`
**Severity:** Moderate
**Description:**
`shouldSkipComment` returns `false` (proceed to comment) if the API check fails. This prioritizes "ensure comment exists" over "prevent duplicates", which might cause spam during API instability.

## Styling & Stability
*   **iPad/Layout:** No UI changes detected. Backend logic only.
*   **Styling:** Code adheres to project patterns.
