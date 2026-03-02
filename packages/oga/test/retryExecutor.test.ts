import { describe, expect, it, vi } from "vitest";
import { executeWithRetry } from "../src/execution/retryExecutor.js";

describe("executeWithRetry", () => {
  it("test_executeWithRetry_non_retryable_throws_immediately", async () => {
    const operation = vi.fn(async () => {
      throw new Error("fatal");
    });

    await expect(
      executeWithRetry(operation, {
        classifyError: () => ({ retryable: false }),
        sleep: async () => undefined
      })
    ).rejects.toThrow("fatal");

    expect(operation).toHaveBeenCalledTimes(1);
  });

  it("test_executeWithRetry_retryable_succeeds_after_retry", async () => {
    const operation = vi
      .fn<[], Promise<string>>()
      .mockRejectedValueOnce(new Error("rate limited"))
      .mockResolvedValueOnce("ok");

    const sleep = vi.fn(async () => undefined);

    const result = await executeWithRetry(operation, {
      classifyError: () => ({ retryable: true }),
      sleep
    });

    expect(result).toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });
});
