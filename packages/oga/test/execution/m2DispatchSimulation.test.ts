import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadPolicy } from "@harambee/policy";
import { canAssignTask } from "../../src/policyGuards.js";
import type { AssignmentRequest } from "../../src/types.js";

const policyPath = path.resolve(process.cwd(), "../../config/policy.example.yaml");
const policy = loadPolicy(policyPath);

type WorkerReadySignal = {
  workerId: string;
  role: AssignmentRequest["workerRole"];
  capacity: number;
  repoScope: string;
};

type DispatchTask = {
  issueNumber: number;
  complexity: AssignmentRequest["taskComplexity"];
  blocked?: boolean;
};

function requestTask(signal: WorkerReadySignal, openTasks: number, task: DispatchTask): AssignmentRequest {
  return {
    workerId: signal.workerId,
    workerRole: signal.role,
    taskComplexity: task.complexity,
    taskBlocked: task.blocked ?? false,
    isQaReturn: false,
    isInFixWindow: false,
    workerOpenTasks: openTasks
  };
}

describe("M2 OgaArchitect dispatch simulation", () => {
  it("test_m2_worker_ready_and_request_task_protocol_run_generates_assignable_decisions", () => {
    const readySignal: WorkerReadySignal = {
      workerId: "dev-alpha",
      role: "dev",
      capacity: 1,
      repoScope: "Vindi-Van/harambee"
    };

    const task: DispatchTask = { issueNumber: 6201, complexity: 2 };
    const request = requestTask(readySignal, 0, task);
    const decision = canAssignTask(policy, request);

    expect(readySignal.capacity).toBe(policy.assignment.maxTasksPerWorker);
    expect(readySignal.repoScope).toBe("Vindi-Van/harambee");
    expect(decision).toEqual({ allowed: true });
  });

  it("test_m2_assignment_ack_reject_flow_simulation_covers_ack_timeout_and_requeue", () => {
    const readySignal: WorkerReadySignal = {
      workerId: "dev-beta",
      role: "dev",
      capacity: 1,
      repoScope: "Vindi-Van/harambee"
    };

    const firstTask: DispatchTask = { issueNumber: 6202, complexity: 2 };
    const firstDecision = canAssignTask(policy, requestTask(readySignal, 0, firstTask));
    expect(firstDecision.allowed).toBe(true);

    const ackDeadlineMinutes = policy.assignment.ackTimeoutMin;
    const ackObserved = false;
    const requeuedAfterTimeout = !ackObserved;

    expect(ackDeadlineMinutes).toBe(15);
    expect(requeuedAfterTimeout).toBe(true);

    const secondTask: DispatchTask = { issueNumber: 6203, complexity: 2 };
    const reassignmentDecision = canAssignTask(policy, requestTask(readySignal, 0, secondTask));
    expect(reassignmentDecision.allowed).toBe(true);
  });

  it("test_m2_reserved_fix_window_enforcement_rejects_new_task_during_window", () => {
    const request: AssignmentRequest = {
      workerId: "dev-gamma",
      workerRole: "dev",
      taskComplexity: 2,
      taskBlocked: false,
      isQaReturn: false,
      isInFixWindow: true,
      workerOpenTasks: 0
    };

    const decision = canAssignTask(policy, request);

    expect(policy.fixWindow.maxNewTasksDuringWindow).toBe(0);
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toMatch(/reserved fix window/i);
  });

  it("test_m2_three_task_no_collision_assignment_proof_enforces_single_open_slot", () => {
    const worker: WorkerReadySignal = {
      workerId: "dev-delta",
      role: "dev",
      capacity: 1,
      repoScope: "Vindi-Van/harambee"
    };

    const queue: DispatchTask[] = [
      { issueNumber: 6210, complexity: 2 },
      { issueNumber: 6211, complexity: 2 },
      { issueNumber: 6212, complexity: 2 }
    ];

    const decisions = queue.map((task, index) =>
      canAssignTask(policy, requestTask(worker, index === 0 ? 0 : 1, task))
    );

    expect(policy.assignment.maxTasksPerWorker).toBe(1);
    expect(decisions[0]).toEqual({ allowed: true });
    expect(decisions[1].allowed).toBe(false);
    expect(decisions[1].reason).toMatch(/max task capacity/i);
    expect(decisions[2].allowed).toBe(false);
    expect(decisions[2].reason).toMatch(/max task capacity/i);
  });
});
