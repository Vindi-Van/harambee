import type {
  AssignmentDecisionHandler,
  ExecutionAction,
  TransitionDecisionHandler
} from "./types.js";

/**
 * In-memory assignment handler for side-effect-safe scaffolding and tests.
 */
export class InMemoryAssignmentHandler implements AssignmentDecisionHandler {
  public readonly actions: ExecutionAction[] = [];

  public async handle(action: ExecutionAction): Promise<void> {
    this.actions.push(action);
  }
}

/**
 * In-memory transition handler for side-effect-safe scaffolding and tests.
 */
export class InMemoryTransitionHandler implements TransitionDecisionHandler {
  public readonly actions: ExecutionAction[] = [];

  public async handle(action: ExecutionAction): Promise<void> {
    this.actions.push(action);
  }
}
