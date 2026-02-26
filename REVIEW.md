# Code Review for PR Merge: `c8bc79c8d` (Retry Policy Integration)

**Reviewer:** Jules (Senior Code Reviewer)
**Date:** 2026-02-26
**Status:** Approved with Comments

## Summary
The PR introduces a robust retry mechanism with exponential backoff and jitter, effectively enhancing resilience against transient GitHub API failures. The implementation is logically sound but exposes a pre-existing architectural issue regarding handler lifecycle.

## Detailed Feedback

### 1. Logic & Architecture (Major Issue): Lifecycle Conflict
*   **File:** `packages/oga/src/execution/github/githubAssignmentHandler.ts` & `githubTransitionHandler.ts`
*   **Issue:** The `seenRequestIds` set is intended to prevent duplicate processing. However, `createGitHubExecutionDispatcher` instantiates new handlers for every request (per `runtimeBindings.ts`).
*   **Impact:** `seenRequestIds` is effectively useless as it never persists across function calls. It implies safety that doesn't exist.
*   **Recommendation:** Remove `seenRequestIds` if it serves no purpose in the current architecture, or move the deduplication logic to a persistent layer (e.g., database or long-lived service).

### 2. Reliability: Idempotency of Comments
*   **File:** `packages/oga/src/execution/github/githubAssignmentHandler.ts`
*   **Issue:** Retrying `client.createComment` can lead to duplicates if the failure occurs after the server processed the request (e.g., network timeout receiving response).
*   **Recommendation:** Implement a check-then-act pattern: verify if a comment with the specific `requestId` already exists before attempting to create it.

### 3. Configuration: Retry Policy
*   **File:** `packages/oga/src/execution/retryPolicy.ts`
*   **Observation:** The `defaultRetryPolicy` (3 attempts, start 250ms) is quite aggressive.
*   **Recommendation:** Consider allowing the handlers to accept a custom `RetryPolicy` or increasing the default limits to handle longer outages (e.g., GitHub secondary rate limits).

### 4. Verification
*   **Tests:** `npm run -w @harambee/oga test` passed successfully, confirming the retry logic works as intended with the mocks.
*   **UI/Performance:** These changes are backend-only (`@harambee/oga`) and have **zero impact** on React Native components, iPad Air layout, or Flexbox styling.

## Conclusion
The retry logic implementation is correct and well-tested. However, the `seenRequestIds` lifecycle mismatch should be addressed as technical debt.
