# Code Review: `@harambee/oga` Execution & Idempotency

**Status:** ⚠️ **Request Changes** (Critical Logic Gap Identified)

I have reviewed the changes in `packages/oga` regarding the GitHub execution handlers, idempotency store, and retry policies.

## 1. 🛑 Logic & Potential Bugs
**Critical: Ineffective Default Idempotency**
In `packages/oga/src/execution/github/githubAssignmentHandler.ts` (and `githubTransitionHandler.ts`):
```typescript
this.idempotencyStore = context.idempotencyStore ?? new InMemoryIdempotencyStore();
```
Combined with `createGitHubExecutionDispatcher` in `packages/oga/src/execution/github/createGitHubExecutionDispatcher.ts`:
```typescript
export function createGitHubExecutionDispatcher(context: GitHubExecutionContext): ExecutionDispatcher {
  const assignmentHandler = new GitHubAssignmentHandler(context.client, context.assignment);
  // ...
}
```
**Issue:** `createGitHubExecutionDispatcher` instantiates *new* handlers on every invocation. If `context.assignment.idempotencyStore` is undefined, a fresh `InMemoryIdempotencyStore` is created for that specific request.
**Impact:** This renders the idempotency logic useless for preventing duplicate processing across different requests (which is the primary use case), as state is not shared.
**Recommendation:** Ensure `idempotencyStore` is a required property or that the dependency injection layer (`runtimeBindings.ts`) explicitly manages a singleton/shared store instance before passing it to the factory.

**Minor: Fail-Open Comment Check**
In `shouldSkipComment`:
```typescript
} catch {
  // Fail-open: if comment lookup fails, continue and attempt createComment.
  return false;
}
```
**Observation:** This strategy prioritizes "at-least-once" delivery. Be aware that transient API read failures (e.g., GitHub rate limits or timeouts) will result in duplicate comments. This is likely acceptable but worth noting as a deliberate trade-off.

## 2. 🚀 Performance (React Native / iPad)
*   **Verified:** The changes are exclusively within the `@harambee/oga` backend package.
*   **Result:** No React Native, Flexbox, or UI components are present. The strict constraints regarding "iPad Air layout stability" and "rotation-safe Flexbox" are **Not Applicable** to this specific PR.

## 3. 🎨 Styling & Standards
*   **Passed:** Code structure follows the project's TypeScript patterns.
*   **Passed:** Error handling correctly wraps specific failures in `GitHubExecutionError`.

## Summary
The code structure is clean, but the **Idempotency Store injection strategy is flawed**. The current default behavior creates a per-request store, negating the feature's purpose. This must be addressed before merging.
