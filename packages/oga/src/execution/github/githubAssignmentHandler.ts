import type { AssignmentDecisionHandler, ExecutionAction } from "../types.js";
import type { GitHubClient } from "./githubClient.js";

/**
 * Context required to execute assignment mutations on a GitHub issue.
 */
export interface GitHubAssignmentContext {
  owner: string;
  repo: string;
  issueNumber: number;
  assignees: string[];
  labels: string[];
}

/**
 * GitHub-backed assignment decision handler.
 *
 * Applies assignment labels/assignees/comments for allowed decisions,
 * and writes auditable denial comments for denied decisions.
 */
export class GitHubAssignmentHandler implements AssignmentDecisionHandler {
  private readonly client: GitHubClient;
  private readonly context: GitHubAssignmentContext;
  private readonly seenRequestIds: Set<string>;

  constructor(client: GitHubClient, context: GitHubAssignmentContext) {
    this.client = client;
    this.context = context;
    this.seenRequestIds = new Set<string>();
  }

  public async handle(action: ExecutionAction): Promise<void> {
    if (action.kind !== "assignment") {
      throw new Error("GitHubAssignmentHandler only supports assignment actions");
    }

    if (this.seenRequestIds.has(action.requestId)) {
      return;
    }

    const issueRef = {
      owner: this.context.owner,
      repo: this.context.repo,
      issueNumber: this.context.issueNumber
    };

    if (!action.allowed) {
      await this.client.createComment({
        ...issueRef,
        body: `Assignment denied (requestId: ${action.requestId}). Reason: ${action.reason ?? "unknown"}`
      });
      this.seenRequestIds.add(action.requestId);
      return;
    }

    await this.client.addAssignees({
      ...issueRef,
      assignees: this.context.assignees
    });

    await this.client.addLabels({
      ...issueRef,
      labels: this.context.labels
    });

    await this.client.createComment({
      ...issueRef,
      body: `Assignment applied (requestId: ${action.requestId}).`
    });

    this.seenRequestIds.add(action.requestId);
  }
}
