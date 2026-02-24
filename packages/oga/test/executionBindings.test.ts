import path from "node:path";
import { describe, expect, it } from "vitest";
import { OgaRuntimeService } from "../src/engine.js";
import { ExecutionDispatcher } from "../src/execution/dispatcher.js";
import {
  InMemoryAssignmentHandler,
  InMemoryTransitionHandler
} from "../src/execution/inMemoryHandlers.js";
import {
  processAssignment,
  processTransition
} from "../src/execution/runtimeBindings.js";

const policyPath = path.resolve(process.cwd(), "../../config/policy.example.yaml");

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
});
