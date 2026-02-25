/**
 * Error wrapper for GitHub-backed execution failures.
 */
export class GitHubExecutionError extends Error {
  public readonly retryable: boolean;
  public readonly causeError: unknown;

  constructor(message: string, retryable: boolean, causeError: unknown) {
    super(message);
    this.name = "GitHubExecutionError";
    this.retryable = retryable;
    this.causeError = causeError;
  }
}
