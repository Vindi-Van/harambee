import { defaultRetryPolicy, getRetryDecision, type RetryPolicy } from "./retryPolicy.js";

/**
 * Retry-capable execution options.
 */
export interface RetryExecutionOptions {
  policy?: RetryPolicy;
  classifyError?: (error: unknown) => { retryable: boolean } | undefined;
  sleep?: (delayMs: number) => Promise<void>;
}

/**
 * Execute an async operation with retry/backoff policy.
 *
 * @param operation - Async operation to execute.
 * @param options - Retry options.
 * @returns Operation result when successful.
 * @throws Last seen error when retries are exhausted/non-retryable.
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  options: RetryExecutionOptions = {}
): Promise<T> {
  const policy = options.policy ?? defaultRetryPolicy;
  const classifyError = options.classifyError ?? (() => ({ retryable: false }));
  const sleep = options.sleep ?? ((delayMs: number) => new Promise<void>((resolve) => setTimeout(resolve, delayMs)));

  let attempt = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await operation();
    } catch (error: unknown) {
      const retryable = classifyError(error)?.retryable ?? false;
      const decision = getRetryDecision(attempt, retryable, policy);
      if (!decision.shouldRetry) {
        throw error;
      }

      await sleep(decision.delayMs);
      attempt += 1;
    }
  }
}
