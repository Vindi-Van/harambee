import { describe, expect, it } from "vitest";
import { enforceOgaRolePolicy, findActiveOgaAgent } from "../src/gh.js";

describe("findActiveOgaAgent", () => {
  it("returns active oga agent from registry table", () => {
    const body = `## Active Agents\n| Agent | Role | Status | Updated At |\n|---|---|---|---|\n| rand | oga | active | 2026-03-01T00:00:00Z |`;
    expect(findActiveOgaAgent(body)).toBe("rand");
  });

  it("returns null when no active oga exists", () => {
    const body = `## Active Agents\n| Agent | Role | Status | Updated At |\n|---|---|---|---|\n| perrin | dev | active | 2026-03-01T00:00:00Z |`;
    expect(findActiveOgaAgent(body)).toBeNull();
  });
});

describe("enforceOgaRolePolicy", () => {
  it("throws when another active oga exists and no override", () => {
    const body = `| Agent | Role | Status | Updated At |\n|---|---|---|---|\n| rand | oga | active | 2026-03-01T00:00:00Z |`;
    expect(() =>
      enforceOgaRolePolicy({
        requestedRole: "oga",
        viewer: "matrim",
        registryBody: body,
        allowOgaOverride: false
      })
    ).toThrow(/Oga activation blocked/);
  });

  it("does not throw with override", () => {
    const body = `| Agent | Role | Status | Updated At |\n|---|---|---|---|\n| rand | oga | active | 2026-03-01T00:00:00Z |`;
    expect(() =>
      enforceOgaRolePolicy({
        requestedRole: "oga",
        viewer: "matrim",
        registryBody: body,
        allowOgaOverride: true
      })
    ).not.toThrow();
  });

  it("does not throw when same agent is active oga", () => {
    const body = `| Agent | Role | Status | Updated At |\n|---|---|---|---|\n| matrim | oga | active | 2026-03-01T00:00:00Z |`;
    expect(() =>
      enforceOgaRolePolicy({
        requestedRole: "oga",
        viewer: "matrim",
        registryBody: body
      })
    ).not.toThrow();
  });
});
