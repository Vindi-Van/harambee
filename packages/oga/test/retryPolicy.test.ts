import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultRetryPolicy, getRetryDecision } from "../src/execution/retryPolicy.js";

describe("getRetryDecision", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("test_getRetryDecision_non_retryable_returns_false", () => {
    const result = getRetryDecision(1, false, defaultRetryPolicy);
    expect(result.shouldRetry).toBe(false);
    expect(result.delayMs).toBe(0);
  });

  it("test_getRetryDecision_last_attempt_returns_false", () => {
    const result = getRetryDecision(defaultRetryPolicy.maxAttempts, true, defaultRetryPolicy);
    expect(result.shouldRetry).toBe(false);
    expect(result.delayMs).toBe(0);
  });

  it("test_getRetryDecision_retryable_returns_delay_with_jitter", () => {
    const rnd = vi.spyOn(Math, "random").mockReturnValue(0.5);
    const result = getRetryDecision(1, true, defaultRetryPolicy);
    expect(result.shouldRetry).toBe(true);
    expect(result.delayMs).toBe(250);
    rnd.mockRestore();
  });
});
