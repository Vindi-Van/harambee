/**
 * Retry policy configuration for runtime execution failures.
 */
export interface RetryPolicy {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterRatio: number;
}

/**
 * Classify a retry attempt decision.
 */
export interface RetryDecision {
  shouldRetry: boolean;
  delayMs: number;
}

/**
 * Decide whether an operation should retry and compute delay.
 *
 * @param attempt - 1-indexed attempt number.
 * @param retryable - Whether the error is retryable.
 * @param policy - Retry policy settings.
 * @returns Retry decision with delay when applicable.
 */
export function getRetryDecision(
  attempt: number,
  retryable: boolean,
  policy: RetryPolicy
): RetryDecision {
  if (!retryable || attempt >= policy.maxAttempts) {
    return { shouldRetry: false, delayMs: 0 };
  }

  const exp = Math.max(0, attempt - 1);
  const rawDelay = policy.baseDelayMs * Math.pow(2, exp);
  const capped = Math.min(rawDelay, policy.maxDelayMs);
  const jitter = capped * policy.jitterRatio;
  const randomized = capped - jitter + Math.random() * (jitter * 2);

  return { shouldRetry: true, delayMs: Math.max(0, Math.floor(randomized)) };
}

/**
 * Default retry policy for GitHub execution handlers.
 */
export const defaultRetryPolicy: RetryPolicy = {
  maxAttempts: 3,
  baseDelayMs: 250,
  maxDelayMs: 5_000,
  jitterRatio: 0.2
};
