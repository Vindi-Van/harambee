import type { OgaRuntimeService } from "../engine.js";
import type { AdapterDecisionOutput, AssignmentAdapterInput } from "./types.js";

/**
 * Handle assignment decision inputs from external adapters.
 *
 * @param runtime - Oga runtime decision service.
 * @param input - Assignment envelope from event/cli/webhook source.
 * @returns Normalized adapter decision output.
 */
export function handleAssignmentInput(
  runtime: OgaRuntimeService,
  input: AssignmentAdapterInput
): AdapterDecisionOutput {
  const result = runtime.evaluateAssignment(input.payload);

  return {
    requestId: input.requestId,
    allowed: result.allowed,
    reason: result.reason,
    route: "assign"
  };
}
