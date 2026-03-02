import { describe, expect, it } from "vitest";

type TaskState = "queued" | "assigned" | "in_progress" | "reclaiming" | "complete" | "blocker";

type LeaseRecord = {
  taskId: string;
  workerId: string;
  token: string;
  expiresAtMs: number;
  reclaimAttempts: number;
  state: TaskState;
  history: string[];
};

type CoordinatorConfig = {
  leaseTtlMs: number;
  reclaimGraceMs: number;
  maxReclaimAttempts: number;
};

class FakeClock {
  private nowMs = 0;

  now(): number {
    return this.nowMs;
  }

  advance(ms: number): void {
    this.nowMs += ms;
  }
}

class InMemoryRedisCoordination {
  private readonly leases = new Map<string, LeaseRecord>();

  constructor(
    private readonly config: CoordinatorConfig,
    private readonly now: () => number
  ) {}

  assign(taskId: string, workerId: string): { ok: boolean; token?: string; reason?: string } {
    const existing = this.leases.get(taskId);
    if (existing && this.now() < existing.expiresAtMs && existing.state !== "queued") {
      return { ok: false, reason: "lease already held" };
    }

    const token = `${taskId}:${workerId}:${this.now()}`;
    const previousAttempts = existing?.reclaimAttempts ?? 0;
    const record: LeaseRecord = {
      taskId,
      workerId,
      token,
      expiresAtMs: this.now() + this.config.leaseTtlMs,
      reclaimAttempts: previousAttempts,
      state: "assigned",
      history: [
        ...(existing?.history ?? []),
        `assigned:${workerId}`
      ]
    };

    this.leases.set(taskId, record);
    return { ok: true, token };
  }

  heartbeat(taskId: string, token: string): boolean {
    const record = this.leases.get(taskId);
    if (!record || record.token !== token || record.state === "blocker") {
      return false;
    }

    record.expiresAtMs = this.now() + this.config.leaseTtlMs;
    record.state = "in_progress";
    record.history.push(`heartbeat:${record.workerId}`);
    return true;
  }

  reclaim(taskId: string, options?: { inFixWindow?: boolean }): { reclaimed: boolean; escalated?: boolean } {
    const record = this.leases.get(taskId);
    if (!record) return { reclaimed: false };

    if (options?.inFixWindow) {
      record.history.push("reclaim_deferred_fix_window");
      return { reclaimed: false };
    }

    const reclaimAtMs = record.expiresAtMs + this.config.reclaimGraceMs;
    if (this.now() < reclaimAtMs) return { reclaimed: false };

    record.reclaimAttempts += 1;
    record.state = "reclaiming";
    record.history.push(`reclaiming:${record.workerId}`);

    if (record.reclaimAttempts > this.config.maxReclaimAttempts) {
      record.state = "blocker";
      record.history.push("escalated:blocker");
      return { reclaimed: false, escalated: true };
    }

    record.state = "queued";
    record.history.push("queued");
    return { reclaimed: true };
  }

  get(taskId: string): LeaseRecord | undefined {
    return this.leases.get(taskId);
  }
}

describe("M4 Redis coordination failure simulation", () => {
  const config: CoordinatorConfig = {
    leaseTtlMs: 30_000,
    reclaimGraceMs: 20_000,
    maxReclaimAttempts: 2
  };

  it("test_m4_lease_exclusivity_under_contention_allows_single_winner", () => {
    const clock = new FakeClock();
    const coordinator = new InMemoryRedisCoordination(config, () => clock.now());

    const a = coordinator.assign("task-701", "worker-a");
    const b = coordinator.assign("task-701", "worker-b");

    expect(a.ok).toBe(true);
    expect(b.ok).toBe(false);
    expect(b.reason).toMatch(/lease already held/i);
    expect(coordinator.get("task-701")?.workerId).toBe("worker-a");
  });

  it("test_m4_stale_worker_reclaim_requeues_then_reassigns_to_new_worker", () => {
    const clock = new FakeClock();
    const coordinator = new InMemoryRedisCoordination(config, () => clock.now());

    coordinator.assign("task-702", "worker-a");
    clock.advance(config.leaseTtlMs + config.reclaimGraceMs + 1);

    const reclaim = coordinator.reclaim("task-702");
    const reassigned = coordinator.assign("task-702", "worker-b");
    const lease = coordinator.get("task-702");

    expect(reclaim.reclaimed).toBe(true);
    expect(reassigned.ok).toBe(true);
    expect(lease?.workerId).toBe("worker-b");
    expect(lease?.history).toEqual([
      "assigned:worker-a",
      "reclaiming:worker-a",
      "queued",
      "assigned:worker-b"
    ]);
  });

  it("test_m4_fix_window_defers_reclaim_until_window_expires", () => {
    const clock = new FakeClock();
    const coordinator = new InMemoryRedisCoordination(config, () => clock.now());

    const assigned = coordinator.assign("task-703", "worker-a");
    clock.advance(config.leaseTtlMs + config.reclaimGraceMs + 1);

    const deferred = coordinator.reclaim("task-703", { inFixWindow: true });
    const leaseWhileDeferred = coordinator.get("task-703");

    expect(assigned.ok).toBe(true);
    expect(deferred.reclaimed).toBe(false);
    expect(leaseWhileDeferred?.state).toBe("assigned");

    const reclaimed = coordinator.reclaim("task-703", { inFixWindow: false });

    expect(reclaimed.reclaimed).toBe(true);
    expect(coordinator.get("task-703")?.state).toBe("queued");
  });

  it("test_m4_retry_cap_escalates_to_blocker_after_max_reclaims", () => {
    const clock = new FakeClock();
    const coordinator = new InMemoryRedisCoordination(config, () => clock.now());

    coordinator.assign("task-704", "worker-a");

    for (let i = 0; i < config.maxReclaimAttempts; i += 1) {
      clock.advance(config.leaseTtlMs + config.reclaimGraceMs + 1);
      const reclaimed = coordinator.reclaim("task-704");
      expect(reclaimed.reclaimed).toBe(true);
      const reassigned = coordinator.assign("task-704", `worker-r${i}`);
      expect(reassigned.ok).toBe(true);
    }

    clock.advance(config.leaseTtlMs + config.reclaimGraceMs + 1);
    const escalated = coordinator.reclaim("task-704");
    const lease = coordinator.get("task-704");

    expect(escalated.reclaimed).toBe(false);
    expect(escalated.escalated).toBe(true);
    expect(lease?.state).toBe("blocker");
    expect(lease?.history.at(-1)).toBe("escalated:blocker");
  });
});
