# Code Review: @harambee/oga (GitHub Execution Handlers)

**Reviewer:** Jules
**Date:** Feb 26, 2026
**Scope:** GitHub Assignment & Transition Handlers, Idempotency, Retry Logic

## Summary
The PR introduces a solid foundation for GitHub-based execution with retry logic and idempotency guards. The code is strictly backend (TypeScript), so iPad/Flexbox constraints are N/A. However, I identified a significant architectural caveat regarding the lifecycle of the `IdempotencyStore` when using the new runtime bindings.

## Findings

### 1. Logic & Bugs

#### **A. Idempotency Store Lifecycle (Critical)**
*   **File:** `packages/oga/src/execution/runtimeBindings.ts`
*   **Issue:** The helper functions `processAssignmentWithGitHub` and `processTransitionWithGitHub` instantiate a new `dispatcher` (via `createGitHubExecutionDispatcher`) on every invocation.
*   **Impact:** If the provided `context` does not explicitly include a shared `idempotencyStore`, the handlers default to a fresh `InMemoryIdempotencyStore` for each request. This renders the idempotency mechanism ineffective for cross-request deduplication (e.g., handling duplicate webhook deliveries or caller-side retries), as the store's state is lost when the function returns.
*   **Feedback:** Ensure callers are aware that they must inject a shared/durable `IdempotencyStore` into the `context` if they require actual deduplication across separate runtime invocations.

#### **B. Comment Deduplication "Fail-Open" Strategy**
*   **Files:** `packages/oga/src/execution/github/githubAssignmentHandler.ts`, `packages/oga/src/execution/github/githubTransitionHandler.ts`
*   **Issue:** The `shouldSkipComment` method uses a "fail-open" strategy (returns `false` on error).
*   **Impact:** If `hasRequestComment` fails (e.g., due to a temporary network read timeout) but the subsequent `createComment` write succeeds, this will result in duplicate comments.
*   **Feedback:** While this maximizes the chance of posting the comment, be aware of the duplicate risk during API degradation.

### 2. Performance
*   **Assessment:** No issues. The sequential execution of API calls (`addAssignees`, `addLabels`, `createComment`) is appropriate for ensuring correct error handling and state recovery in this context.

### 3. Styling
*   **Assessment:** Code adheres to project structure and TypeScript standards.

### 4. iPad / Flexbox Constraints
*   **Assessment:** Verified. No UI code or React Native components were found in the modified files. The strict backend nature ensures no regression in layout stability.

## Conclusion
The implementation is robust but requires careful integration (specifically regarding `IdempotencyStore` injection) to fully realize the intended durability guarantees.
