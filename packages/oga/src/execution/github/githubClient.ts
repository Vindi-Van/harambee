/**
 * Minimal GitHub client boundary for assignment execution side effects.
 */
export interface GitHubClient {
  isRetryableError?(error: unknown): boolean;
  classifyError?(error: unknown): { retryable: boolean; reason?: string; retryAfterMs?: number };
  addAssignees(params: {
    owner: string;
    repo: string;
    issueNumber: number;
    assignees: string[];
  }): Promise<void>;
  addLabels(params: {
    owner: string;
    repo: string;
    issueNumber: number;
    labels: string[];
  }): Promise<void>;
  createComment(params: {
    owner: string;
    repo: string;
    issueNumber: number;
    body: string;
  }): Promise<void>;
}
