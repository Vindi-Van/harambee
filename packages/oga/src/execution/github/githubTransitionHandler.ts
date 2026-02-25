import type { ExecutionAction, TransitionDecisionHandler } from "../types.js";
import type { GitHubClient } from "./githubClient.js";
import { GitHubExecutionError } from "./githubExecutionError.js";

/**
 * Context required to execute transition mutations on a GitHub issue.
 */
export interface GitHubTransitionContext {
  owner: string;
  repo: string;
  issueNumber: number;
  transitionLabels: string[];
}

/**
 * GitHub-backed transition decision handler.
 *
 * Applies transition labels/comments for allowed decisions,
 * and writes auditable denial comments for denied decisions.
 */
export class GitHubTransitionHandler implements TransitionDecisionHandler {
  private readonly client: GitHubClient;
  private readonly context: GitHubTransitionContext;
  private readonly seenRequestIds: Set<string>;

  constructor(client: GitHubClient, context: GitHubTransitionContext) {
    this.client = client;
    this.context = context;
    this.seenRequestIds = new Set<string>();
  }

  public async handle(action: ExecutionAction): Promise<void> {
    if (action.kind !== "transition") {
      throw new Error("GitHubTransitionHandler only supports transition actions");
    }

    if (this.seenRequestIds.has(action.requestId)) {
      return;
    }

    const issueRef = {
      owner: this.context.owner,
      repo: this.context.repo,
      issueNumber: this.context.issueNumber
    };

    try {
      if (!action.allowed) {
        await this.client.createComment({
          ...issueRef,
          body: `Transition denied (requestId: ${action.requestId}). Reason: ${action.reason ?? "unknown"}`
        });
        this.seenRequestIds.add(action.requestId);
        return;
      }

      if (this.context.transitionLabels.length > 0) {
        await this.client.addLabels({
          ...issueRef,
          labels: this.context.transitionLabels
        });
      }

      await this.client.createComment({
        ...issueRef,
        body: `Transition applied (requestId: ${action.requestId}).`
      });

      this.seenRequestIds.add(action.requestId);
    } catch (error: unknown) {
      const classification = this.client.classifyError?.(error);
      const retryable = classification?.retryable ?? false;
      throw new GitHubExecutionError(
        `GitHub transition execution failed for requestId ${action.requestId}`,
        retryable,
        error
      );
    }
  }
}
