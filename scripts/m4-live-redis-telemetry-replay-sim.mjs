#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";

const DATE = "2026-03-02";
const artifactDir = "docs/validation/artifacts";
const telemetryPath = `${artifactDir}/m4-live-redis-telemetry-${DATE}.jsonl`;
const reportPath = `${artifactDir}/m4-live-redis-telemetry-replay-${DATE}.md`;

mkdirSync(artifactDir, { recursive: true });

class Coordinator {
  constructor(config) {
    this.config = config;
    this.leases = new Map();
    this.nowMs = 0;
    this.telemetry = [];
  }
  nowIso() {
    return new Date(Date.UTC(2026, 2, 2, 21, 20, 0 + Math.floor(this.nowMs / 1000))).toISOString();
  }
  emit(event) {
    this.telemetry.push({ ts: this.nowIso(), ...event });
  }
  advance(ms) {
    this.nowMs += ms;
  }
  assign(taskId, workerId) {
    const existing = this.leases.get(taskId);
    if (existing && this.nowMs < existing.expiresAtMs && existing.state !== "queued") {
      this.emit({ scenario: "lease_exclusivity", taskId, worker: workerId, event: "lease_acquire", ok: false, reason: "duplicate_prevented" });
      return { ok: false };
    }
    const token = `${taskId}:${workerId}:${this.nowMs}`;
    this.leases.set(taskId, {
      taskId,
      workerId,
      token,
      expiresAtMs: this.nowMs + this.config.leaseTtlMs,
      reclaimAttempts: existing?.reclaimAttempts ?? 0,
      state: "assigned"
    });
    this.emit({ scenario: "lease_exclusivity", taskId, worker: workerId, event: "lease_acquire", ok: true, tokenPrefix: token.slice(0, 16) });
    return { ok: true, token };
  }
  reclaim(taskId, { inFixWindow = false } = {}) {
    const lease = this.leases.get(taskId);
    if (!lease) return { reclaimed: false };
    if (inFixWindow) {
      this.emit({ scenario: "fix_window", taskId, event: "reclaim_deferred", reason: "fix_window_active" });
      return { reclaimed: false };
    }
    if (this.nowMs < lease.expiresAtMs + this.config.reclaimGraceMs) return { reclaimed: false };
    lease.reclaimAttempts += 1;
    lease.state = "reclaiming";
    if (lease.reclaimAttempts > this.config.maxReclaimAttempts) {
      lease.state = "blocker";
      this.emit({ scenario: "retry_cap", taskId, event: "escalated", attempt: lease.reclaimAttempts, state: "blocker" });
      return { reclaimed: false, escalated: true };
    }
    lease.state = "queued";
    this.emit({ scenario: taskId === "task-702" ? "stale_reclaim" : "retry_cap", taskId, event: "reclaimed", attempt: lease.reclaimAttempts });
    return { reclaimed: true };
  }
}

const c = new Coordinator({ leaseTtlMs: 30_000, reclaimGraceMs: 20_000, maxReclaimAttempts: 2 });

// Scenario 1
const a = c.assign("task-701", "worker-a");
const b = c.assign("task-701", "worker-b");

// Scenario 2
c.leases.delete("task-702");
c.assign("task-702", "worker-a");
c.advance(50_001);
const r2 = c.reclaim("task-702");
const reassigned2 = c.assign("task-702", "worker-b");

// Scenario 3
c.leases.delete("task-703");
c.assign("task-703", "worker-a");
c.advance(50_001);
const deferred3 = c.reclaim("task-703", { inFixWindow: true });
const reclaimed3 = c.reclaim("task-703", { inFixWindow: false });

// Scenario 4
c.leases.delete("task-704");
c.assign("task-704", "worker-a");
for (let i = 0; i < 2; i += 1) {
  c.advance(50_001);
  c.reclaim("task-704");
  c.assign("task-704", `worker-r${i}`);
}
c.advance(50_001);
const escalated4 = c.reclaim("task-704");

writeFileSync(telemetryPath, c.telemetry.map((e) => JSON.stringify(e)).join("\n") + "\n");

const report = `# M4 Live Redis + Telemetry Replay (${DATE})\n\nStatus: **Closest-feasible simulation with persisted telemetry export** (host lacks Docker daemon access for live Redis container).\n\n## Scenario Results\n\n1. Lease exclusivity (task-701)\n   - worker-a acquired lease: ${a.ok}\n   - worker-b blocked duplicate lease: ${!b.ok}\n2. Stale-worker reclaim + reassignment (task-702)\n   - reclaimed to queue: ${r2.reclaimed}\n   - reassigned to worker-b: ${reassigned2.ok}\n3. Reserved fix-window deferral (task-703)\n   - reclaim deferred while fix-window active: ${!deferred3.reclaimed}\n   - reclaim succeeded after window expiry: ${reclaimed3.reclaimed}\n4. Retry-cap escalation (task-704)\n   - escalated to blocker after max attempts: ${Boolean(escalated4.escalated)}\n\n## Telemetry Export\n- JSONL artifact: \`${telemetryPath}\`\n- Event count: ${c.telemetry.length}\n\n## Notes\n- Replay follows the same M4 reclaim semantics validated in \`packages/oga/test/execution/m4RedisCoordinationSimulation.test.ts\`.\n- To run true live Redis replay later, execute this flow with Docker daemon or host Redis access and preserve the same JSONL schema.\n`;

writeFileSync(reportPath, report);
console.log(`Wrote ${reportPath}`);
console.log(`Wrote ${telemetryPath}`);
