import type { AssignmentRequest, TransitionRequest } from "../types.js";

/**
 * Adapter input envelope for assignment decision requests.
 */
export interface AssignmentAdapterInput {
  requestId: string;
  source: "event" | "cli" | "webhook";
  payload: AssignmentRequest;
}

/**
 * Adapter input envelope for transition decision requests.
 */
export interface TransitionAdapterInput {
  requestId: string;
  source: "event" | "cli" | "webhook";
  payload: TransitionRequest;
}

/**
 * Unified adapter output payload.
 */
export interface AdapterDecisionOutput {
  requestId: string;
  allowed: boolean;
  reason?: string;
  route: "assign" | "transition";
}
