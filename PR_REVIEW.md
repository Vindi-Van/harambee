# PR Review: GitHub Assignment Execution Handler

**Commit:** `89de534e2f622662f6d7c56339afd1b532739313` (Merge `6a2b673`)

## Summary
This PR introduces the `GitHubAssignmentHandler` scaffold and related types. The implementation provides a solid foundation but has a significant logic concern regarding the handler's lifecycle and state management.

## Findings

### 1. Logic & Architecture (Critical)
**File:** `packages/oga/src/execution/github/githubAssignmentHandler.ts`

The `GitHubAssignmentHandler` class accepts a specific `context` (containing `issueNumber`, `assignees`, `labels`) in its constructor, implying a "per-request" instance. However, it also maintains `seenRequestIds` as an instance member, implying a "long-lived" service intended to handle multiple requests.

*   **Scenario A (Per-Request):** If the handler is recreated for every request (to inject the specific context), `seenRequestIds` will be empty each time, failing to deduplicate.
*   **Scenario B (Long-Lived):** If the handler is reused (singleton), the `context` is static, meaning it can only process assignments for the *exact same* issue and assignee configuration.

**Recommendation:** Refactor to either pass the assignment details (assignees, labels, issue) as part of the `ExecutionAction` payload in the `handle` method, or clarify that the handler is strictly single-use (in which case `seenRequestIds` should be scoped differently or removed).

### 2. Optimization
**File:** `packages/oga/src/execution/github/githubAssignmentHandler.ts` (Lines 36-46)

The `addAssignees` and `addLabels` methods are called unconditionally.

**Recommendation:** Add a check `if (this.context.assignees.length > 0)` and `if (this.context.labels.length > 0)` before calling the respective client methods. This prevents unnecessary API calls and potential errors if the API rejects empty arrays.

### 3. Testing
**File:** `packages/oga/test/execution/githubAssignmentHandler.test.ts`

The tests cover the `allowed` and `denied` paths well.

**Recommendation:** Add a test case where `assignees` and `labels` are empty arrays to verify that the handler behaves correctly (either by skipping the calls or handling them gracefully).

### 4. Specific Focus Areas
*   **iPad Air Layout & Rotation-Safe Flexbox:** N/A. This PR contains only backend logic and no UI components (React/React Native).
*   **Performance:** No significant performance bottlenecks identified in the logic.

## Conclusion
Please address the lifecycle ambiguity in `GitHubAssignmentHandler` before merging.
