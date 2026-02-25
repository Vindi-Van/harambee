export type {
  AssignmentRequest,
  GuardResult,
  OgaRuntimeContext,
  TaskStage,
  TransitionRequest,
  WorkerRole
} from "./types.js";

export {
  canAssignTask,
  canTransitionStage,
  requiresHumanApprovalForPr
} from "./policyGuards.js";

export type { AssignmentDecision, TransitionDecision } from "./engine.js";
export { OgaRuntimeService } from "./engine.js";

export type {
  AdapterDecisionOutput,
  AssignmentAdapterInput,
  TransitionAdapterInput
} from "./adapters/types.js";

export { handleAssignmentInput } from "./adapters/assignmentAdapter.js";
export { handleTransitionInput } from "./adapters/transitionAdapter.js";
export { handleWebhookPayload } from "./adapters/webhookAdapter.js";

export type {
  AssignmentDecisionHandler,
  ExecutionAction,
  TransitionDecisionHandler
} from "./execution/types.js";
export { toExecutionAction } from "./execution/types.js";
export { ExecutionDispatcher } from "./execution/dispatcher.js";
export {
  InMemoryAssignmentHandler,
  InMemoryTransitionHandler
} from "./execution/inMemoryHandlers.js";
export {
  processAssignment,
  processAssignmentWithGitHub,
  processTransition,
  processTransitionWithGitHub
} from "./execution/runtimeBindings.js";

export type { GitHubClient } from "./execution/github/githubClient.js";
export type { GitHubAssignmentContext } from "./execution/github/githubAssignmentHandler.js";
export { GitHubAssignmentHandler } from "./execution/github/githubAssignmentHandler.js";
export type { GitHubTransitionContext } from "./execution/github/githubTransitionHandler.js";
export { GitHubTransitionHandler } from "./execution/github/githubTransitionHandler.js";
export type { GitHubExecutionContext } from "./execution/github/createGitHubExecutionDispatcher.js";
export { createGitHubExecutionDispatcher } from "./execution/github/createGitHubExecutionDispatcher.js";
