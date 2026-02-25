import { ExecutionDispatcher } from "../dispatcher.js";
import type { GitHubAssignmentContext } from "./githubAssignmentHandler.js";
import { GitHubAssignmentHandler } from "./githubAssignmentHandler.js";
import type { GitHubClient } from "./githubClient.js";
import type { GitHubTransitionContext } from "./githubTransitionHandler.js";
import { GitHubTransitionHandler } from "./githubTransitionHandler.js";

/**
 * Context bundle for constructing GitHub-backed execution handlers.
 */
export interface GitHubExecutionContext {
  client: GitHubClient;
  assignment: GitHubAssignmentContext;
  transition: GitHubTransitionContext;
}

/**
 * Create an execution dispatcher backed by GitHub assignment and transition handlers.
 *
 * @param context - GitHub client and handler contexts.
 * @returns Configured execution dispatcher.
 */
export function createGitHubExecutionDispatcher(
  context: GitHubExecutionContext
): ExecutionDispatcher {
  const assignmentHandler = new GitHubAssignmentHandler(context.client, context.assignment);
  const transitionHandler = new GitHubTransitionHandler(context.client, context.transition);

  return new ExecutionDispatcher(assignmentHandler, transitionHandler);
}
