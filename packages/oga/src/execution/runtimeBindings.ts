import type { OgaRuntimeService } from "../engine.js";
import type {
  AssignmentAdapterInput,
  TransitionAdapterInput
} from "../adapters/types.js";
import { handleAssignmentInput } from "../adapters/assignmentAdapter.js";
import { handleTransitionInput } from "../adapters/transitionAdapter.js";
import { ExecutionDispatcher } from "./dispatcher.js";

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
