import type { OgaRuntimeService } from "../engine.js";
import type { AdapterDecisionOutput, TransitionAdapterInput } from "./types.js";

/**
 * Handle transition decision inputs from external adapters.
 *
 * @param runtime - Oga runtime decision service.
 * @param input - Transition envelope from event/cli/webhook source.
 * @returns Normalized adapter decision output.
 */
export function handleTransitionInput(
  runtime: OgaRuntimeService,
  input: TransitionAdapterInput
): AdapterDecisionOutput {
  const result = runtime.evaluateTransition(input.payload);

  return {
    requestId: input.requestId,
    allowed: result.allowed,
    reason: result.reason,
    route: "transition"
  };
}
