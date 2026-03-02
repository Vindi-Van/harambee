import type { AdapterDecisionOutput } from "../adapters/types.js";

/**
 * Execution action emitted by adapter decision routing.
 */
export interface ExecutionAction {
  kind: "assignment" | "transition";
  requestId: string;
  allowed: boolean;
  reason?: string;
}

/**
 * Handler contract for assignment decisions.
 */
export interface AssignmentDecisionHandler {
  handle(action: ExecutionAction): Promise<void>;
}

/**
 * Handler contract for transition decisions.
 */
export interface TransitionDecisionHandler {
  handle(action: ExecutionAction): Promise<void>;
}

/**
 * Convert adapter decision output into execution action payload.
 *
 * @param route - Route kind.
 * @param decision - Adapter decision output.
 * @returns Execution action.
 */
export function toExecutionAction(
  route: "assignment" | "transition",
  decision: AdapterDecisionOutput
): ExecutionAction {
  return {
    kind: route,
    requestId: decision.requestId,
    allowed: decision.allowed,
    reason: decision.reason
  };
}
