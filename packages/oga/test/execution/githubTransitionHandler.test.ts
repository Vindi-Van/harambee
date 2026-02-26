import { afterEach, describe, expect, it, vi } from "vitest";
import { InMemoryIdempotencyStore } from "../../src/execution/idempotencyStore.js";
import type { GitHubClient } from "../../src/execution/github/githubClient.js";
import { GitHubExecutionError } from "../../src/execution/github/githubExecutionError.js";
import { GitHubTransitionHandler } from "../../src/execution/github/githubTransitionHandler.js";

function createMockClient(): GitHubClient {
  return {
    addAssignees: vi.fn(async () => undefined),
    addLabels: vi.fn(async () => undefined),
    createComment: vi.fn(async () => undefined),
    hasRequestComment: vi.fn(async () => false),
    classifyError: vi.fn(() => ({ retryable: false }))
  };
}

describe("GitHubTransitionHandler", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("test_allowed_transition_applies_github_mutations", async () => {
    const client = createMockClient();
    const handler = new GitHubTransitionHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 125,
      transitionLabels: ["stage:verification", "status:waiting-review"]
    });

    await handler.handle({
      kind: "transition",
      requestId: "req-tr-1",
      allowed: true
    });

    expect(client.addLabels).toHaveBeenCalledOnce();
    expect(client.createComment).toHaveBeenCalledOnce();
    expect(client.addAssignees).not.toHaveBeenCalled();

    expect(client.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        issueNumber: 125,
        body: expect.stringContaining("requestId: req-tr-1")
      })
    );
  });

  it("test_denied_transition_is_non_mutating_but_auditable", async () => {
    const client = createMockClient();
    const handler = new GitHubTransitionHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 126,
      transitionLabels: ["stage:verification"]
    });

    await handler.handle({
      kind: "transition",
      requestId: "req-tr-2",
      allowed: false,
      reason: "missing artifacts"
    });

    expect(client.addLabels).not.toHaveBeenCalled();
    expect(client.addAssignees).not.toHaveBeenCalled();
    expect(client.createComment).toHaveBeenCalledOnce();
    expect(client.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("missing artifacts")
      })
    );
  });

  it("test_transition_error_uses_retry_classifier", async () => {
    const client = createMockClient();
    (client.addLabels as any).mockRejectedValueOnce(new Error("rate limited"));
    (client.classifyError as any).mockReturnValueOnce({ retryable: false });

    const handler = new GitHubTransitionHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 127,
      transitionLabels: ["stage:verification"]
    });

    await expect(
      handler.handle({
        kind: "transition",
        requestId: "req-tr-3",
        allowed: true
      })
    ).rejects.toMatchObject({
      name: "GitHubExecutionError",
      retryable: false
    } satisfies Partial<GitHubExecutionError>);
  });

  it("test_transition_retryable_error_retries_then_succeeds", async () => {
    const client = createMockClient();
    (client.addLabels as any)
      .mockRejectedValueOnce(new Error("rate limited"))
      .mockResolvedValueOnce(undefined);
    (client.classifyError as any).mockReturnValue({ retryable: true });

    const sleep = vi.spyOn(globalThis, "setTimeout").mockImplementation((fn: TimerHandler) => {
      if (typeof fn === "function") fn();
      return 0 as unknown as ReturnType<typeof setTimeout>;
    });

    const handler = new GitHubTransitionHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 128,
      transitionLabels: ["stage:verification"]
    });

    await handler.handle({
      kind: "transition",
      requestId: "req-tr-4",
      allowed: true
    });

    expect(client.addLabels).toHaveBeenCalledTimes(2);
    sleep.mockRestore();
  });

  it("test_transition_skips_comment_when_request_comment_already_exists", async () => {
    const client = createMockClient();
    (client.hasRequestComment as any).mockResolvedValue(true);

    const handler = new GitHubTransitionHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 129,
      transitionLabels: ["stage:verification"]
    });

    await handler.handle({
      kind: "transition",
      requestId: "req-tr-5",
      allowed: true
    });

    expect(client.addLabels).toHaveBeenCalledOnce();
    expect(client.hasRequestComment).toHaveBeenCalledOnce();
    expect(client.hasRequestComment).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: "Vindi-Van",
        repo: "harambee",
        issueNumber: 129,
        requestId: "req-tr-5"
      })
    );
    expect(client.createComment).not.toHaveBeenCalled();
  });

  it("test_denied_transition_skips_comment_when_request_comment_already_exists", async () => {
    const client = createMockClient();
    (client.hasRequestComment as any).mockResolvedValue(true);

    const handler = new GitHubTransitionHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 130,
      transitionLabels: ["stage:verification"]
    });

    await handler.handle({
      kind: "transition",
      requestId: "req-tr-6",
      allowed: false
    });

    expect(client.hasRequestComment).toHaveBeenCalledOnce();
    expect(client.hasRequestComment).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: "Vindi-Van",
        repo: "harambee",
        issueNumber: 130,
        requestId: "req-tr-6"
      })
    );
    expect(client.createComment).not.toHaveBeenCalled();
    expect(client.addLabels).not.toHaveBeenCalled();
    expect(client.addAssignees).not.toHaveBeenCalled();
  });

  it("test_transition_shared_store_skips_repeat_across_handler_instances", async () => {
    const client = createMockClient();
    const idempotencyStore = new InMemoryIdempotencyStore();

    const handlerA = new GitHubTransitionHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 131,
      transitionLabels: ["stage:verification"],
      idempotencyStore
    });

    const handlerB = new GitHubTransitionHandler(client, {
      owner: "Vindi-Van",
      repo: "harambee",
      issueNumber: 131,
      transitionLabels: ["stage:verification"],
      idempotencyStore
    });

    await handlerA.handle({
      kind: "transition",
      requestId: "req-tr-7",
      allowed: true
    });

    await handlerB.handle({
      kind: "transition",
      requestId: "req-tr-7",
      allowed: true
    });

    expect(client.addLabels).toHaveBeenCalledTimes(1);
    expect(client.createComment).toHaveBeenCalledTimes(1);
  });
});
