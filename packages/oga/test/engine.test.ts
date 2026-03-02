import path from "node:path";
import { describe, expect, it } from "vitest";
import { OgaRuntimeService } from "../src/engine.js";

const policyPath = path.resolve(process.cwd(), "../../config/policy.example.yaml");

describe("OgaRuntimeService", () => {
  it("test_evaluateAssignment_when_worker_has_capacity_returns_allowed", () => {
    const service = new OgaRuntimeService(policyPath);

    const result = service.evaluateAssignment({
      workerId: "qa-1",
      workerRole: "qa",
      taskComplexity: 2,
      taskBlocked: false,
      isQaReturn: false,
      isInFixWindow: false,
      workerOpenTasks: 0
    });

    expect(result.allowed).toBe(true);
    expect(result.workerId).toBe("qa-1");
  });

  it("test_evaluateTransition_when_reviewer_missing_returns_rejected", () => {
    const service = new OgaRuntimeService(policyPath);

    const result = service.evaluateTransition({
      from: "execution",
      to: "verification",
      hasRequiredArtifacts: true,
      hasIndependentReviewerApproval: false,
      humanApproved: true,
      complexity: 3,
      decomposedForExecution: true
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/Independent reviewer approval required/);
  });
});
