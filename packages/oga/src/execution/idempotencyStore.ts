/**
 * Unique key describing one execution request whose side effects must be deduplicated.
 */
export interface ExecutionIdempotencyKey {
  owner: string;
  repo: string;
  issueNumber: number;
  kind: "assignment" | "transition";
  requestId: string;
}

/**
 * Store contract for execution idempotency.
 *
 * Implementations should provide atomic `tryMarkProcessed` semantics.
 */
export interface IdempotencyStore {
  /**
   * Atomically mark a key as processed.
   * @returns true when this caller marked first; false when key was already marked.
   */
  tryMarkProcessed(key: ExecutionIdempotencyKey): Promise<boolean>;

  /**
   * Best-effort rollback for cases where processing fails after an early mark.
   */
  clearProcessed(key: ExecutionIdempotencyKey): Promise<void>;
}

function serializeKey(key: ExecutionIdempotencyKey): string {
  return JSON.stringify([key.owner, key.repo, key.issueNumber, key.kind, key.requestId]);
}

/**
 * In-memory idempotency store for single-process usage and tests.
 *
 * Note: this does not provide cross-process durability by itself.
 */
export class InMemoryIdempotencyStore implements IdempotencyStore {
  private readonly seen = new Set<string>();

  public async tryMarkProcessed(key: ExecutionIdempotencyKey): Promise<boolean> {
    const serialized = serializeKey(key);
    if (this.seen.has(serialized)) {
      return false;
    }
    this.seen.add(serialized);
    return true;
  }

  public async clearProcessed(key: ExecutionIdempotencyKey): Promise<void> {
    this.seen.delete(serializeKey(key));
  }
}
