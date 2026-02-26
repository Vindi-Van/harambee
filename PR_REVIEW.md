# Code Review Feedback

## Summary
The PR introduces robust retry logic and GitHub handler wiring. However, there are significant findings related to **idempotency lifecycle** and **retry timing** that need to be addressed before merging.

Since this is a backend-only change, the "iPad Air" and "React Native" constraints were verified as non-applicable (no UI code present).

## Logic Errors & Potential Bugs

### 1. Ineffective Idempotency (Per-Request Instantiation)
**File:** `packages/oga/src/execution/runtimeBindings.ts`
**Line:** 44 (and 56) inside `processAssignmentWithGitHub` / `processTransitionWithGitHub`

```typescript
export async function processAssignmentWithGitHub(
  runtime: OgaRuntimeService,
  context: GitHubExecutionContext,
  input: AssignmentAdapterInput
): Promise<void> {
  // CRITICAL: This creates a NEW dispatcher (and thus NEW handlers) for every request.
  // The handlers default to `new InMemoryIdempotencyStore()` if one isn't provided in `context`.
  // Unless the caller injects a shared singleton Store into `context`, every request starts with an empty store.
  const dispatcher = createGitHubExecutionDispatcher(context);
  await processAssignment(runtime, dispatcher, input);
}
```

**Impact:** The deduplication logic in `GitHubAssignmentHandler` (using `seenRequestIds` and `idempotencyStore`) will fail across multiple webhooks because the store is thrown away after every request.
**Suggestion:** The `ExecutionDispatcher` (or at least the `IdempotencyStore`) should be instantiated **once** at the application entry point and passed into the runtime bindings, rather than being created inside the binding function.

### 2. Retry Jitter Can Exceed Max Delay
**File:** `packages/oga/src/execution/retryPolicy.ts`
**Line:** 39

```typescript
  const capped = Math.min(rawDelay, policy.maxDelayMs);
  const jitter = capped * policy.jitterRatio;
  // CRITICAL: This formula allows the result to be `capped + jitter`.
  // If capped is 5000 and jitter is 1000, result can be 6000.
  const randomized = capped - jitter + Math.random() * (jitter * 2);
```

**Impact:** The delay can exceed the configured `maxDelayMs`, violating the configuration contract.
**Suggestion:** Clamp the final `delayMs` result: `Math.min(policy.maxDelayMs, Math.max(0, Math.floor(randomized)))`.

### 3. Fail-Open Comment Check
**File:** `packages/oga/src/execution/github/githubAssignmentHandler.ts`
**Line:** 44

```typescript
    } catch {
      // Fail-open: if comment lookup fails, continue and attempt createComment.
      return false;
    }
```

**Observation:** While "fail-open" is safe for ensuring comments are posted, combined with the idempotency issue above, this guarantees duplicate comments if the GitHub API has intermittent read failures (e.g. rate limits on GET but not POST).
**Suggestion:** Consider if a strict check is safer, or rely on the `idempotencyStore` being fixed (Point #1) to handle this.

## Performance & Styling
* **Performance:** No React Native code found. Backend performance looks fine, provided the retry loop doesn't get stuck (the `maxAttempts` guard handles this).
* **Styling:** Code adheres to the project's TypeScript style (indentation, types).

## iPad Air / Layout Stability
* **Status:** **N/A**. Verified that `packages/oga` contains no `react` or `react-native` dependencies. This is a pure logic package.

## Verification
* **Tests:** Existing tests pass (`npm run -w @harambee/oga test`).
* **Jitter Verification:** A script confirmed that delays can exceed `maxDelayMs`.
