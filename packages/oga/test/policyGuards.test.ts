import { describe, expect, it } from "vitest";
import { loadPolicy } from "@harambee/policy";
import path from "node:path";
import { canAssignTask, canTransitionStage, requiresHumanApprovalForPr } from "../src/index.js";

const policyPath = path.resolve(process.cwd(), "../../config/policy.example.yaml");
const policy = loadPolicy(policyPath);

describe("canAssignTask", () => {
  it("test_canAssignTask_when_worker_in_fix_window_and_strict_window_rejects", () => {
    const result = canAssignTask(policy, {
      workerId: "dev-1",
      workerRole: "dev",
      taskComplexity: 2,
      taskBlocked: false,
      isQaReturn: false,
      isInFixWindow: true,
      workerOpenTasks: 0
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/fix window/i);
  });

  it("test_canAssignTask_when_simple_ready_task_allows", () => {
    const result = canAssignTask(policy, {
      workerId: "qa-1",
      workerRole: "qa",
      taskComplexity: 2,
      taskBlocked: false,
      isQaReturn: false,
      isInFixWindow: false,
      workerOpenTasks: 0
    });

    expect(result.allowed).toBe(true);
  });
});

describe("canTransitionStage", () => {
  it("test_canTransitionStage_execution_to_verification_without_reviewer_rejects", () => {
    const result = canTransitionStage(policy, {
      from: "execution",
      to: "verification",
      hasRequiredArtifacts: true,
      hasIndependentReviewerApproval: false,
      humanApproved: true,
      complexity: 3,
      decomposedForExecution: true
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/reviewer/i);
  });

  it("test_canTransitionStage_to_execution_without_decomposition_for_c4_rejects", () => {
    const result = canTransitionStage(policy, {
      from: "decomposition",
      to: "execution",
      hasRequiredArtifacts: true,
      hasIndependentReviewerApproval: true,
      humanApproved: true,
      complexity: 4,
      decomposedForExecution: false
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/decomposed/i);
  });
});

describe("requiresHumanApprovalForPr", () => {
  it("test_requiresHumanApprovalForPr_when_complexity_meets_threshold_returns_true", () => {
    const result = requiresHumanApprovalForPr(policy, {
      from: "verification",
      to: "deployment",
      hasRequiredArtifacts: true,
      hasIndependentReviewerApproval: true,
      humanApproved: false,
      complexity: 4,
      decomposedForExecution: true
    });

    expect(result).toBe(true);
  });
});
