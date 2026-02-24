import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  handleAssignmentInput,
  handleTransitionInput,
  handleWebhookPayload,
  OgaRuntimeService
} from "../src/index.js";

const policyPath = path.resolve(process.cwd(), "../../config/policy.example.yaml");

describe("oga adapters", () => {
  it("test_handleAssignmentInput_returns_normalized_decision", () => {
    const runtime = new OgaRuntimeService(policyPath);
    const output = handleAssignmentInput(runtime, {
      requestId: "req-assign-1",
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

    expect(output.route).toBe("assign");
    expect(output.allowed).toBe(true);
  });

  it("test_handleTransitionInput_returns_rejection_reason_when_invalid", () => {
    const runtime = new OgaRuntimeService(policyPath);
    const output = handleTransitionInput(runtime, {
      requestId: "req-trans-1",
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

    expect(output.route).toBe("transition");
    expect(output.allowed).toBe(false);
    expect(output.reason).toMatch(/reviewer/i);
  });

  it("test_handleWebhookPayload_routes_assignment_payload", () => {
    const runtime = new OgaRuntimeService(policyPath);
    const output = handleWebhookPayload(runtime, {
      type: "assignment",
      requestId: "req-webhook-1",
      payload: {
        workerId: "qa-2",
        workerRole: "qa",
        taskComplexity: 1,
        taskBlocked: false,
        isQaReturn: false,
        isInFixWindow: false,
        workerOpenTasks: 0
      }
    });

    expect(output.route).toBe("assign");
    expect(output.allowed).toBe(true);
  });
});
