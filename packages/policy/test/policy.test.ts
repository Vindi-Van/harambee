import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadPolicy } from "../src/loadPolicy.js";

const fixturePath = path.resolve(process.cwd(), "../../config/policy.example.yaml");

describe("loadPolicy", () => {
  it("test_loadPolicy_valid_config_returns_policy", () => {
    const config = loadPolicy(fixturePath);
    expect(config.roles.ogaArchitect.enabled).toBe(true);
    expect(config.communication.canonicalSurface).toBe("github");
  });

  it("test_loadPolicy_invalid_config_throws_error", () => {
    const tempPath = path.resolve(process.cwd(), "tmp.invalid.policy.yaml");
    fs.writeFileSync(tempPath, "approval:\n  allPrsRequireHumanApproval: maybe\n", "utf8");

    try {
      expect(() => loadPolicy(tempPath)).toThrowError(/Invalid policy config/);
    } finally {
      fs.unlinkSync(tempPath);
    }
  });
});
