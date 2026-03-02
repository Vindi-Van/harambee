import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { OgaRuntimeService } from "../../src/engine.js";
import { InMemoryIdempotencyStore } from "../../src/execution/idempotencyStore.js";
import type { GitHubClient } from "../../src/execution/github/githubClient.js";
import {
  processAssignmentWithGitHub,
  processTransitionWithGitHub
} from "../../src/execution/runtimeBindings.js";

const policyPath = path.resolve(process.cwd(), "../../config/policy.example.yaml");

function createFaultInjectionClient(options?: {
  failAddAssigneesTimes?: number;
  failAddLabelsTimes?: number;
  retryable?: boolean;
}): GitHubClient {
  let addAssigneesFailuresRemaining = options?.failAddAssigneesTimes ?? 0;
  let addLabelsFailuresRemaining = options?.failAddLabelsTimes ?? 0;
  const retryable = options?.retryable ?? true;

  return {
    addAssignees: vi.fn(async () => {
      if (addAssigneesFailuresRemaining > 0) {
        addAssigneesFailuresRemaining -= 1;
        throw new Error("fault:addAssignees");
      }
    }),
    addLabels: vi.fn(async () => {
      if (addLabelsFailuresRemaining > 0) {
        addLabelsFailuresRemaining -= 1;
        throw new Error("fault:addLabels");
      }
    }),
    createComment: vi.fn(async () => undefined),
    hasRequestComment: vi.fn(async () => false),
    classifyError: vi.fn(() => ({ retryable }))
  };
}

describe("runtime harness", () => {
  it("test_harness_execution_path_dispatches_assignment_and_transition", async () => {
    const runtime = new OgaRuntimeService(policyPath);
    const client = createFaultInjectionClient();

    await processAssignmentWithGitHub(
      runtime,
      {
        client,
        assignment: {
          owner: "Vindi-Van",
          repo: "harambee",
          issueNumber: 5201,
          assignees: ["matrim"],
          labels: ["stage:execution"]
        },
        transition: {
          owner: "Vindi-Van",
          repo: "harambee",
          issueNumber: 5201,
          transitionLabels: ["stage:verification"]
        }
      },
      {
        requestId: "req-harness-execution-a",
        source: "cli",
        payload: {
          workerId: "dev-1",
          workerRole: "dev",
          taskComplexity: 2,
          taskBlocked: false,
          isQaReturn: false,
          isInFixWindow: false,
          workerOpenTasks: 0
        }
      }
    );

    await processTransitionWithGitHub(
      runtime,
      {
        client,
        assignment: {
          owner: "Vindi-Van",
          repo: "harambee",
          issueNumber: 5201,
          assignees: ["matrim"],
          labels: ["stage:execution"]
        },
        transition: {
          owner: "Vindi-Van",
          repo: "harambee",
          issueNumber: 5201,
          transitionLabels: ["stage:verification"]
        }
      },
      {
        requestId: "req-harness-execution-b",
        source: "event",
        payload: {
          from: "verification",
          to: "deployment",
          hasRequiredArtifacts: true,
          hasIndependentReviewerApproval: true,
          humanApproved: true,
          complexity: 2,
          decomposedForExecution: true
        }
      }
    );

    expect(client.addAssignees).toHaveBeenCalledTimes(1);
    expect(client.addLabels).toHaveBeenCalledTimes(2);
    expect(client.createComment).toHaveBeenCalledTimes(2);
  });

  it("test_harness_idempotency_path_deduplicates_replayed_request", async () => {
    const runtime = new OgaRuntimeService(policyPath);
    const idempotencyStore = new InMemoryIdempotencyStore();
    const client = createFaultInjectionClient();

    const context = {
      client,
      assignment: {
        owner: "Vindi-Van",
        repo: "harambee",
        issueNumber: 5202,
        assignees: ["matrim"],
        labels: ["stage:execution"],
        idempotencyStore
      },
      transition: {
        owner: "Vindi-Van",
        repo: "harambee",
        issueNumber: 5202,
        transitionLabels: ["stage:verification"],
        idempotencyStore
      }
    };

    const request = {
      requestId: "req-harness-idempotent",
      source: "cli" as const,
      payload: {
        workerId: "dev-2",
        workerRole: "dev",
        taskComplexity: 2,
        taskBlocked: false,
        isQaReturn: false,
        isInFixWindow: false,
        workerOpenTasks: 0
      }
    };

    await processAssignmentWithGitHub(runtime, context, request);
    await processAssignmentWithGitHub(runtime, context, request);

    expect(client.addAssignees).toHaveBeenCalledTimes(1);
    expect(client.addLabels).toHaveBeenCalledTimes(1);
    expect(client.createComment).toHaveBeenCalledTimes(1);
  });

  it("test_harness_retry_fault_path_recovers_from_transient_github_errors", async () => {
    const runtime = new OgaRuntimeService(policyPath);
    const sleep = vi.spyOn(globalThis, "setTimeout").mockImplementation((fn: TimerHandler) => {
      if (typeof fn === "function") fn();
      return 0 as unknown as ReturnType<typeof setTimeout>;
    });

    const client = createFaultInjectionClient({
      failAddAssigneesTimes: 1,
      failAddLabelsTimes: 1,
      retryable: true
    });

    await processAssignmentWithGitHub(
      runtime,
      {
        client,
        assignment: {
          owner: "Vindi-Van",
          repo: "harambee",
          issueNumber: 5203,
          assignees: ["matrim"],
          labels: ["stage:execution"]
        },
        transition: {
          owner: "Vindi-Van",
          repo: "harambee",
          issueNumber: 5203,
          transitionLabels: ["stage:verification"]
        }
      },
      {
        requestId: "req-harness-retry",
        source: "cli",
        payload: {
          workerId: "dev-3",
          workerRole: "dev",
          taskComplexity: 2,
          taskBlocked: false,
          isQaReturn: false,
          isInFixWindow: false,
          workerOpenTasks: 0
        }
      }
    );

    expect(client.addAssignees).toHaveBeenCalledTimes(2);
    expect(client.addLabels).toHaveBeenCalledTimes(2);
    expect(client.createComment).toHaveBeenCalledTimes(1);
    expect(client.classifyError).toHaveBeenCalled();

    sleep.mockRestore();
  });
});
