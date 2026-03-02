import { afterEach, describe, expect, it, vi } from "vitest";
import type { IdempotencyStore } from "../../src/execution/idempotencyStore.js";
import { InMemoryIdempotencyStore } from "../../src/execution/idempotencyStore.js";
import { GitHubAssignmentHandler } from "../../src/execution/github/githubAssignmentHandler.js";
import { GitHubExecutionError } from "../../src/execution/github/githubExecutionError.js";
import type { GitHubClient } from "../../src/execution/github/githubClient.js";

function createMockClient(): GitHubClient {
  return {
    addAssignees: vi.fn(async () => undefined),
    addLabels: vi.fn(async () => undefined),
    createComment: vi.fn(async () => undefined),
    hasRequestComment: vi.fn(async () => false),
    classifyError: vi.fn(() => ({ retryable: false }))
  };
}

describe("GitHubAssignmentHandler", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("test_allowed_assignment_applies_github_mutations", async () => {
    const client = createMockClient();
    const handler = new GitHubAssignmentHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 123,
      assignees: ["matrim"],
      labels: ["stage:execution"]
    });

    await handler.handle({
      kind: "assignment",
      requestId: "req-1",
      allowed: true
    });

    expect(client.addAssignees).toHaveBeenCalledOnce();
    expect(client.addLabels).toHaveBeenCalledOnce();
    expect(client.createComment).toHaveBeenCalledOnce();

    expect(client.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        issueNumber: 123,
        body: expect.stringContaining("requestId: req-1")
      })
    );
  });

  it("test_denied_assignment_is_non_mutating_but_auditable", async () => {
    const client = createMockClient();
    const handler = new GitHubAssignmentHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 124,
      assignees: ["matrim"],
      labels: ["stage:execution"]
    });

    await handler.handle({
      kind: "assignment",
      requestId: "req-2",
      allowed: false,
      reason: "policy denied"
    });

    expect(client.addAssignees).not.toHaveBeenCalled();
    expect(client.addLabels).not.toHaveBeenCalled();
    expect(client.createComment).toHaveBeenCalledOnce();
    expect(client.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("policy denied")
      })
    );
  });

  it("test_assignment_retryable_error_retries_then_succeeds", async () => {
    const client = createMockClient();
    (client.addAssignees as any)
      .mockRejectedValueOnce(new Error("rate limited"))
      .mockResolvedValueOnce(undefined);
    (client.classifyError as any).mockReturnValue({ retryable: true });

    vi.spyOn(globalThis, "setTimeout").mockImplementation((fn: TimerHandler) => {
      if (typeof fn === "function") fn();
      return 0 as unknown as ReturnType<typeof setTimeout>;
    });

    const handler = new GitHubAssignmentHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 129,
      assignees: ["matrim"],
      labels: ["stage:execution"]
    });

    await handler.handle({
      kind: "assignment",
      requestId: "req-3",
      allowed: true
    });

    expect(client.addAssignees).toHaveBeenCalledTimes(2);
    expect(client.addLabels).toHaveBeenCalledOnce();
    expect(client.createComment).toHaveBeenCalledOnce();
  });

  it("test_assignment_error_uses_retry_classifier", async () => {
    const client = createMockClient();
    (client.addAssignees as any).mockRejectedValueOnce(new Error("forbidden"));
    (client.classifyError as any).mockReturnValueOnce({ retryable: false });

    const handler = new GitHubAssignmentHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 130,
      assignees: ["matrim"],
      labels: ["stage:execution"]
    });

    await expect(
      handler.handle({
        kind: "assignment",
        requestId: "req-4",
        allowed: true
      })
    ).rejects.toMatchObject({
      name: "GitHubExecutionError",
      retryable: false
    } satisfies Partial<GitHubExecutionError>);
  });

  it("test_assignment_skips_comment_when_request_comment_already_exists", async () => {
    const client = createMockClient();
    (client.hasRequestComment as any).mockResolvedValue(true);

    const handler = new GitHubAssignmentHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 131,
      assignees: ["matrim"],
      labels: ["stage:execution"]
    });

    await handler.handle({
      kind: "assignment",
      requestId: "req-5",
      allowed: true
    });

    expect(client.addAssignees).toHaveBeenCalledOnce();
    expect(client.addLabels).toHaveBeenCalledOnce();
    expect(client.hasRequestComment).toHaveBeenCalledOnce();
    expect(client.hasRequestComment).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: "Vindi-Van",
        repo: "harambee",
        issueNumber: 131,
        requestId: "req-5"
      })
    );
    expect(client.createComment).not.toHaveBeenCalled();
  });

  it("test_denied_assignment_skips_comment_when_request_comment_already_exists", async () => {
    const client = createMockClient();
    (client.hasRequestComment as any).mockResolvedValue(true);

    const handler = new GitHubAssignmentHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 132,
      assignees: ["matrim"],
      labels: ["stage:execution"]
    });

    await handler.handle({
      kind: "assignment",
      requestId: "req-6",
      allowed: false
    });

    expect(client.addAssignees).not.toHaveBeenCalled();
    expect(client.addLabels).not.toHaveBeenCalled();
    expect(client.hasRequestComment).toHaveBeenCalledOnce();
    expect(client.hasRequestComment).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: "Vindi-Van",
        repo: "harambee",
        issueNumber: 132,
        requestId: "req-6"
      })
    );
    expect(client.createComment).not.toHaveBeenCalled();
  });

  it("test_assignment_shared_store_skips_repeat_across_handler_instances", async () => {
    const client = createMockClient();
    const idempotencyStore = new InMemoryIdempotencyStore();

    const handlerA = new GitHubAssignmentHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 133,
      assignees: ["matrim"],
      labels: ["stage:execution"],
      idempotencyStore
    });

    const handlerB = new GitHubAssignmentHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 133,
      assignees: ["matrim"],
      labels: ["stage:execution"],
      idempotencyStore
    });

    await handlerA.handle({
      kind: "assignment",
      requestId: "req-7",
      allowed: true
    });

    await handlerB.handle({
      kind: "assignment",
      requestId: "req-7",
      allowed: true
    });

    expect(client.addAssignees).toHaveBeenCalledTimes(1);
    expect(client.addLabels).toHaveBeenCalledTimes(1);
    expect(client.createComment).toHaveBeenCalledTimes(1);
  });

  it("test_assignment_propagates_when_tryMarkProcessed_throws", async () => {
    const client = createMockClient();
    const idempotencyStore: IdempotencyStore = {
      tryMarkProcessed: vi.fn(async () => {
        throw new Error("store unavailable");
      }),
      clearProcessed: vi.fn(async () => undefined)
    };

    const handler = new GitHubAssignmentHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 134,
      assignees: ["matrim"],
      labels: ["stage:execution"],
      idempotencyStore
    });

    await expect(
      handler.handle({
        kind: "assignment",
        requestId: "req-8",
        allowed: true
      })
    ).rejects.toThrow("store unavailable");

    expect(client.addAssignees).not.toHaveBeenCalled();
    expect(idempotencyStore.clearProcessed).not.toHaveBeenCalled();
  });

  it("test_assignment_clears_claim_when_execution_fails", async () => {
    const client = createMockClient();
    (client.addAssignees as any).mockRejectedValueOnce(new Error("boom"));

    const idempotencyStore: IdempotencyStore = {
      tryMarkProcessed: vi.fn(async () => true),
      clearProcessed: vi.fn(async () => undefined)
    };

    const handler = new GitHubAssignmentHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 135,
      assignees: ["matrim"],
      labels: ["stage:execution"],
      idempotencyStore
    });

    await expect(
      handler.handle({
        kind: "assignment",
        requestId: "req-9",
        allowed: true
      })
    ).rejects.toMatchObject({ name: "GitHubExecutionError" });

    expect(idempotencyStore.clearProcessed).toHaveBeenCalledOnce();
  });
});
