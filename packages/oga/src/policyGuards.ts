import type { PolicyConfig } from "@harambee/policy";
import type { AssignmentRequest, GuardResult, TransitionRequest } from "./types.js";

/**
 * Determine whether a task can be assigned to a worker.
 *
 * @param policy - Active Harambee policy configuration.
 * @param request - Assignment request payload.
 * @returns Guard result describing allow/deny and reason.
 */
export function canAssignTask(policy: PolicyConfig, request: AssignmentRequest): GuardResult {
  if (request.taskBlocked) {
    return { allowed: false, reason: "Task is blocked" };
  }

  if (request.workerOpenTasks >= policy.assignment.maxTasksPerWorker) {
    return { allowed: false, reason: "Worker at max task capacity" };
  }

  if (request.isInFixWindow && policy.fixWindow.maxNewTasksDuringWindow === 0) {
    return { allowed: false, reason: "Worker in reserved fix window" };
  }

  if (
    request.taskComplexity >= policy.workflow.decomposeComplexityAtOrAbove &&
    request.workerRole === "dev" &&
    !request.isQaReturn
  ) {
    return { allowed: false, reason: "Complex task requires decomposition-ready routing" };
  }

  return { allowed: true };
}

/**
 * Determine whether a stage transition is allowed.
 *
 * @param policy - Active Harambee policy configuration.
 * @param request - Transition request payload.
 * @returns Guard result describing allow/deny and reason.
 */
export function canTransitionStage(policy: PolicyConfig, request: TransitionRequest): GuardResult {
  if (policy.workflow.enforceArtifactGates && !request.hasRequiredArtifacts) {
    return { allowed: false, reason: "Required artifacts missing" };
  }

  if (request.from === "execution" && request.to === "verification") {
    if (policy.workflow.enforceIndependentReviewer && !request.hasIndependentReviewerApproval) {
      return { allowed: false, reason: "Independent reviewer approval required" };
    }
  }

  if (request.to === "execution") {
    if (
      request.complexity >= policy.workflow.decomposeComplexityAtOrAbove &&
      !request.decomposedForExecution
    ) {
      return { allowed: false, reason: "Task must be decomposed before execution" };
    }
  }

  if (requiresHumanApprovalForPr(policy, request) && !request.humanApproved) {
    return { allowed: false, reason: "Human approval required by policy" };
  }

  return { allowed: true };
}

/**
 * Determine if human approval is required for the transition.
 *
 * @param policy - Active Harambee policy configuration.
 * @param request - Transition request payload.
 * @returns True when human approval is required.
 */
export function requiresHumanApprovalForPr(
  policy: PolicyConfig,
  request: TransitionRequest
): boolean {
  if (policy.approval.allPrsRequireHumanApproval) {
    return true;
  }

  if (policy.approval.criticalPrsRequireHumanApproval) {
    return request.complexity >= policy.approval.criticality.complexityThreshold;
  }

  return false;
}
