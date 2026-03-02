import fs from "node:fs";
import { parse } from "yaml";
import { policySchema } from "./schema.js";
import type { PolicyConfig } from "./types.js";

/**
 * Load and validate Harambee policy configuration from YAML.
 *
 * @param filePath - Absolute or relative path to policy YAML.
 * @returns Parsed and validated policy config.
 * @throws {Error} When file cannot be read or validation fails.
 */
export function loadPolicy(filePath: string): PolicyConfig {
  const rawYaml = fs.readFileSync(filePath, "utf8");
  const parsed = parse(rawYaml);
  const result = policySchema.safeParse(parsed);

  if (!result.success) {
    throw new Error(`Invalid policy config: ${result.error.message}`);
  }

  return result.data;
}
