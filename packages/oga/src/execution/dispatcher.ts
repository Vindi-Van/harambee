import type { AdapterDecisionOutput } from "../adapters/types.js";
import type {
  AssignmentDecisionHandler,
  TransitionDecisionHandler
} from "./types.js";
import { toExecutionAction } from "./types.js";

/**
 * Dispatch adapter decision outputs to assignment/transition handlers.
 */
export class ExecutionDispatcher {
  private readonly assignmentHandler: AssignmentDecisionHandler;
  private readonly transitionHandler: TransitionDecisionHandler;

  /**
   * Create dispatcher with explicit handler dependencies.
   */
  constructor(
    assignmentHandler: AssignmentDecisionHandler,
    transitionHandler: TransitionDecisionHandler
  ) {
    this.assignmentHandler = assignmentHandler;
    this.transitionHandler = transitionHandler;
  }

  /**
   * Dispatch assignment route decision to assignment handler.
   */
  public async dispatchAssignment(decision: AdapterDecisionOutput): Promise<void> {
    await this.assignmentHandler.handle(toExecutionAction("assignment", decision));
  }

  /**
   * Dispatch transition route decision to transition handler.
   */
  public async dispatchTransition(decision: AdapterDecisionOutput): Promise<void> {
    await this.transitionHandler.handle(toExecutionAction("transition", decision));
  }
}
