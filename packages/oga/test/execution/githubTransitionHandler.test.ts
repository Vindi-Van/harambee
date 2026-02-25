import { describe, expect, it, vi } from "vitest";
import type { GitHubClient } from "../../src/execution/github/githubClient.js";
import { GitHubTransitionHandler } from "../../src/execution/github/githubTransitionHandler.js";

function createMockClient(): GitHubClient {
  return {
    addAssignees: vi.fn(async () => undefined),
    addLabels: vi.fn(async () => undefined),
    createComment: vi.fn(async () => undefined)
  };
}

describe("GitHubTransitionHandler", () => {
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
});
