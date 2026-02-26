export interface ExecutionIdempotencyKey {
  owner: string;
  repo: string;
  issueNumber: number;
  kind: "assignment" | "transition";
  requestId: string;
}

export interface IdempotencyStore {
  isProcessed(key: ExecutionIdempotencyKey): Promise<boolean>;
  markProcessed(key: ExecutionIdempotencyKey): Promise<void>;
}

function serializeKey(key: ExecutionIdempotencyKey): string {
  return `${key.owner}/${key.repo}#${key.issueNumber}:${key.kind}:${key.requestId}`;
}

export class InMemoryIdempotencyStore implements IdempotencyStore {
  private readonly seen = new Set<string>();

  public async isProcessed(key: ExecutionIdempotencyKey): Promise<boolean> {
    return this.seen.has(serializeKey(key));
  }

  public async markProcessed(key: ExecutionIdempotencyKey): Promise<void> {
    this.seen.add(serializeKey(key));
  }
}
