import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { OgaRuntimeService } from "../src/engine.js";
import { ExecutionDispatcher } from "../src/execution/dispatcher.js";
import {
  InMemoryAssignmentHandler,
  InMemoryTransitionHandler
} from "../src/execution/inMemoryHandlers.js";
import {
  processAssignment,
  processAssignmentWithGitHub,
  processTransition,
  processTransitionWithGitHub
} from "../src/execution/runtimeBindings.js";
import type { GitHubClient } from "../src/execution/github/githubClient.js";

const policyPath = path.resolve(process.cwd(), "../../config/policy.example.yaml");

function createMockGitHubClient(): GitHubClient {
  return {
    addAssignees: vi.fn(async () => undefined),
    addLabels: vi.fn(async () => undefined),
    createComment: vi.fn(async () => undefined)
  };
}

describe("execution bindings", () => {
  it("test_processAssignment_writes_action_to_assignment_handler", async () => {
    const runtime = new OgaRuntimeService(policyPath);
    const assignmentHandler = new InMemoryAssignmentHandler();
    const transitionHandler = new InMemoryTransitionHandler();
    const dispatcher = new ExecutionDispatcher(assignmentHandler, transitionHandler);

    await processAssignment(runtime, dispatcher, {
      requestId: "req-exec-assign-1",
      source: "cli",
      payload: {
        workerId: "qa-1",
        workerRole: "qa",
        taskComplexity: 2,
        taskBlocked: false,
        isQaReturn: false,
        isInFixWindow: false,
        workerOpenTasks: 0
      }
    });

    expect(assignmentHandler.actions).toHaveLength(1);
    expect(assignmentHandler.actions[0].kind).toBe("assignment");
    expect(assignmentHandler.actions[0].allowed).toBe(true);
  });

  it("test_processTransition_writes_action_to_transition_handler", async () => {
    const runtime = new OgaRuntimeService(policyPath);
    const assignmentHandler = new InMemoryAssignmentHandler();
    const transitionHandler = new InMemoryTransitionHandler();
    const dispatcher = new ExecutionDispatcher(assignmentHandler, transitionHandler);

    await processTransition(runtime, dispatcher, {
      requestId: "req-exec-transition-1",
      source: "event",
      payload: {
        from: "execution",
        to: "verification",
        hasRequiredArtifacts: true,
        hasIndependentReviewerApproval: false,
        humanApproved: true,
        complexity: 3,
        decomposedForExecution: true
      }
    });

    expect(transitionHandler.actions).toHaveLength(1);
    expect(transitionHandler.actions[0].kind).toBe("transition");
    expect(transitionHandler.actions[0].allowed).toBe(false);
  });

  it("test_processAssignmentWithGitHub_executes_assignment_handler_path", async () => {
    const runtime = new OgaRuntimeService(policyPath);
    const client = createMockGitHubClient();

    await processAssignmentWithGitHub(
      runtime,
      {
        client,
        assignment: {
          owner: "Vindi-Van",
          repo: "harambee",
          issueNumber: 201,
          assignees: ["matrim"],
          labels: ["stage:execution"]
        },
        transition: {
          owner: "Vindi-Van",
          repo: "harambee",
          issueNumber: 201,
          transitionLabels: ["stage:verification"]
        }
      },
      {
        requestId: "req-gh-assign-1",
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

    expect(client.addAssignees).toHaveBeenCalledOnce();
    expect(client.addLabels).toHaveBeenCalledOnce();
    expect(client.createComment).toHaveBeenCalledOnce();
  });

  it("test_processTransitionWithGitHub_executes_transition_handler_path", async () => {
    const runtime = new OgaRuntimeService(policyPath);
    const client = createMockGitHubClient();

    await processTransitionWithGitHub(
      runtime,
      {
        client,
        assignment: {
          owner: "Vindi-Van",
          repo: "harambee",
          issueNumber: 202,
          assignees: ["matrim"],
          labels: ["stage:execution"]
        },
        transition: {
          owner: "Vindi-Van",
          repo: "harambee",
          issueNumber: 202,
          transitionLabels: ["stage:verification"]
        }
      },
      {
        requestId: "req-gh-transition-1",
        source: "event",
        payload: {
          from: "verification",
          to: "deployment",
          hasRequiredArtifacts: true,
          hasIndependentReviewerApproval: true,
          humanApproved: true,
          complexity: 3,
          decomposedForExecution: true
        }
      }
    );

    expect(client.addLabels).toHaveBeenCalledOnce();
    expect(client.createComment).toHaveBeenCalledOnce();
  });
});
