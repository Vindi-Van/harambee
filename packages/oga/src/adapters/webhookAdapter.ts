import type { OgaRuntimeService } from "../engine.js";
import { handleAssignmentInput } from "./assignmentAdapter.js";
import { handleTransitionInput } from "./transitionAdapter.js";
import type {
  AdapterDecisionOutput,
  AssignmentAdapterInput,
  TransitionAdapterInput
} from "./types.js";

/**
 * Handle generic webhook payloads and route to assignment/transition adapters.
 *
 * @param runtime - Oga runtime decision service.
 * @param body - Untrusted webhook payload.
 * @returns Decision output when payload is valid.
 * @throws {Error} When payload type is unknown.
 */
export function handleWebhookPayload(
  runtime: OgaRuntimeService,
  body: { type: "assignment" | "transition"; requestId: string; payload: unknown }
): AdapterDecisionOutput {
  if (body.type === "assignment") {
    return handleAssignmentInput(runtime, {
      requestId: body.requestId,
      source: "webhook",
      payload: body.payload as AssignmentAdapterInput["payload"]
    });
  }

  if (body.type === "transition") {
    return handleTransitionInput(runtime, {
      requestId: body.requestId,
      source: "webhook",
      payload: body.payload as TransitionAdapterInput["payload"]
    });
  }

  throw new Error("Unsupported webhook payload type");
}
