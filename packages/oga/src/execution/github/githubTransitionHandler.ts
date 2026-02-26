import { InMemoryIdempotencyStore, type IdempotencyStore } from "../idempotencyStore.js";
import { executeWithRetry } from "../retryExecutor.js";
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
  idempotencyStore?: IdempotencyStore;
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
  private readonly idempotencyStore: IdempotencyStore;

  private async shouldSkipComment(issueRef: {
    owner: string;
    repo: string;
    issueNumber: number;
  }, requestId: string): Promise<boolean> {
    try {
      const alreadyCommented =
        (await this.client.hasRequestComment?.({
          ...issueRef,
          requestId
        })) ?? false;
      return alreadyCommented;
    } catch {
      // Fail-open: if comment lookup fails, continue and attempt createComment.
      return false;
    }
  }

  constructor(client: GitHubClient, context: GitHubTransitionContext) {
    this.client = client;
    this.context = context;
    this.seenRequestIds = new Set<string>();
    this.idempotencyStore = context.idempotencyStore ?? new InMemoryIdempotencyStore();
  }

  public async handle(action: ExecutionAction): Promise<void> {
    if (action.kind !== "transition") {
      throw new Error("GitHubTransitionHandler only supports transition actions");
    }

    if (this.seenRequestIds.has(action.requestId)) {
      return;
    }

    const idempotencyKey = {
      owner: this.context.owner,
      repo: this.context.repo,
      issueNumber: this.context.issueNumber,
      kind: "transition" as const,
      requestId: action.requestId
    };

    if (await this.idempotencyStore.isProcessed(idempotencyKey)) {
      this.seenRequestIds.add(action.requestId);
      return;
    }

    const issueRef = {
      owner: this.context.owner,
      repo: this.context.repo,
      issueNumber: this.context.issueNumber
    };

    try {
      if (!action.allowed) {
        await executeWithRetry(
          async () => {
            const alreadyCommented = await this.shouldSkipComment(issueRef, action.requestId);
            if (alreadyCommented) {
              return;
            }
            await this.client.createComment({
              ...issueRef,
              body: `Transition denied (requestId: ${action.requestId}). Reason: ${action.reason ?? "unknown"}`
            });
          },
          { classifyError: (error) => this.client.classifyError?.(error) }
        );
        await this.idempotencyStore.markProcessed(idempotencyKey);
        this.seenRequestIds.add(action.requestId);
        return;
      }

      if (this.context.transitionLabels.length > 0) {
        await executeWithRetry(
          async () => {
            await this.client.addLabels({
              ...issueRef,
              labels: this.context.transitionLabels
            });
          },
          { classifyError: (error) => this.client.classifyError?.(error) }
        );
      }

      await executeWithRetry(
        async () => {
          const alreadyCommented = await this.shouldSkipComment(issueRef, action.requestId);
          if (alreadyCommented) {
            return;
          }
          await this.client.createComment({
            ...issueRef,
            body: `Transition applied (requestId: ${action.requestId}).`
          });
        },
        { classifyError: (error) => this.client.classifyError?.(error) }
      );

      await this.idempotencyStore.markProcessed(idempotencyKey);
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
