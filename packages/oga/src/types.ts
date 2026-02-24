import type { PolicyConfig } from "@harambee/policy";

/**
 * Stages in Harambee workflow lifecycle.
 */
export type TaskStage =
  | "intake"
  | "design"
  | "review-gate"
  | "decomposition"
  | "execution"
  | "verification"
  | "deployment";

/**
 * Worker role identity.
 */
export type WorkerRole =
  | "oga-architect"
  | "ui"
  | "dev"
  | "reviewer"
  | "qa"
  | "devops";

/**
 * Assignment request payload.
 */
export interface AssignmentRequest {
  workerId: string;
  workerRole: WorkerRole;
  taskComplexity: 1 | 2 | 3 | 4 | 5;
  taskBlocked: boolean;
  isQaReturn: boolean;
  isInFixWindow: boolean;
  workerOpenTasks: number;
}

/**
 * Stage transition request payload.
 */
export interface TransitionRequest {
  from: TaskStage;
  to: TaskStage;
  hasRequiredArtifacts: boolean;
  hasIndependentReviewerApproval: boolean;
  humanApproved: boolean;
  complexity: 1 | 2 | 3 | 4 | 5;
  decomposedForExecution: boolean;
}

/**
 * Result for policy guard checks.
 */
export interface GuardResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Shared Oga runtime context.
 */
export interface OgaRuntimeContext {
  policy: PolicyConfig;
}
