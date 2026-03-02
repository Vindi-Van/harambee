import { describe, expect, it, vi } from "vitest";

const execFileSyncMock = vi.fn();

vi.mock("node:child_process", () => ({
  execFileSync: execFileSyncMock
}));

describe("ensureGhAuth", () => {
  it("throws actionable auth-failure guidance when gh auth is missing", async () => {
    execFileSyncMock.mockImplementationOnce(() => {
      throw new Error("not logged in");
    });

    const { ensureGhAuth } = await import("../src/gh.js");

    expect(() => ensureGhAuth()).toThrow("GitHub auth missing. Run: gh auth login");
  });
});
