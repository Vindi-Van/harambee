import { describe, expect, it, vi } from "vitest";
import { GitHubAssignmentHandler } from "../../src/execution/github/githubAssignmentHandler.js";
import type { GitHubClient } from "../../src/execution/github/githubClient.js";

function createMockClient(): GitHubClient {
  return {
    addAssignees: vi.fn(async () => undefined),
    addLabels: vi.fn(async () => undefined),
    createComment: vi.fn(async () => undefined)
  };
}

describe("GitHubAssignmentHandler", () => {
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
});
