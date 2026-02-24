import { loadPolicy, type PolicyConfig } from "@harambee/policy";
import { canAssignTask, canTransitionStage } from "./policyGuards.js";
import type { AssignmentRequest, GuardResult, TransitionRequest } from "./types.js";

/**
 * Runtime decision output for assignment checks.
 */
export interface AssignmentDecision extends GuardResult {
  workerId: string;
}

/**
 * Runtime decision output for transition checks.
 */
export interface TransitionDecision extends GuardResult {
  from: string;
  to: string;
}

/**
 * Oga runtime service responsible for applying policy guards to workflow events.
 */
export class OgaRuntimeService {
  private readonly policy: PolicyConfig;

  /**
   * Create an Oga runtime service.
   *
   * @param policyPath - Policy YAML file path to load and validate.
   */
  constructor(policyPath: string) {
    this.policy = loadPolicy(policyPath);
  }

  /**
   * Return active runtime policy.
   */
  public getPolicy(): PolicyConfig {
    return this.policy;
  }

  /**
   * Evaluate whether a worker can be assigned a task.
   *
   * @param request - Assignment request payload.
   * @returns Assignment decision with allow/deny reason.
   */
  public evaluateAssignment(request: AssignmentRequest): AssignmentDecision {
    const guard = canAssignTask(this.policy, request);

    return {
      workerId: request.workerId,
      allowed: guard.allowed,
      reason: guard.reason
    };
  }

  /**
   * Evaluate whether a workflow stage transition is allowed.
   *
   * @param request - Transition request payload.
   * @returns Transition decision with allow/deny reason.
   */
  public evaluateTransition(request: TransitionRequest): TransitionDecision {
    const guard = canTransitionStage(this.policy, request);

    return {
      from: request.from,
      to: request.to,
      allowed: guard.allowed,
      reason: guard.reason
    };
  }
}
