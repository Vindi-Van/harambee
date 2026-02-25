import type { OgaRuntimeService } from "../engine.js";
import type {
  AssignmentAdapterInput,
  TransitionAdapterInput
} from "../adapters/types.js";
import { handleAssignmentInput } from "../adapters/assignmentAdapter.js";
import { handleTransitionInput } from "../adapters/transitionAdapter.js";
import type { ExecutionDispatcher } from "./dispatcher.js";
import {
  createGitHubExecutionDispatcher,
  type GitHubExecutionContext
} from "./github/createGitHubExecutionDispatcher.js";

/**
 * Bind assignment adapter input to execution dispatcher.
 */
export async function processAssignment(
  runtime: OgaRuntimeService,
  dispatcher: ExecutionDispatcher,
  input: AssignmentAdapterInput
): Promise<void> {
  const decision = handleAssignmentInput(runtime, input);
  await dispatcher.dispatchAssignment(decision);
}

/**
 * Bind transition adapter input to execution dispatcher.
 */
export async function processTransition(
  runtime: OgaRuntimeService,
  dispatcher: ExecutionDispatcher,
  input: TransitionAdapterInput
): Promise<void> {
  const decision = handleTransitionInput(runtime, input);
  await dispatcher.dispatchTransition(decision);
}

/**
 * Bind assignment adapter input to GitHub-backed execution handlers.
 */
export async function processAssignmentWithGitHub(
  runtime: OgaRuntimeService,
  context: GitHubExecutionContext,
  input: AssignmentAdapterInput
): Promise<void> {
  const dispatcher = createGitHubExecutionDispatcher(context);
  await processAssignment(runtime, dispatcher, input);
}

/**
 * Bind transition adapter input to GitHub-backed execution handlers.
 */
export async function processTransitionWithGitHub(
  runtime: OgaRuntimeService,
  context: GitHubExecutionContext,
  input: TransitionAdapterInput
): Promise<void> {
  const dispatcher = createGitHubExecutionDispatcher(context);
  // TODO: wrap GitHub dispatch path with retry scheduler for retryable GitHubExecutionError failures.
  await processTransition(runtime, dispatcher, input);
}
