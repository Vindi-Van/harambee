import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { AGENT_ROLES, type AgentRole, type InitConfig } from "./types.js";
import { parseProjectUrl, parseRepoUrl } from "./validate.js";
import {
  enforceOgaRolePolicy,
  ensureGhAuth,
  ensureProjectReadable,
  ensureRegistryIssue,
  ensureRepoWriteAccess,
  getRegistryIssueBody,
  getViewerLogin
} from "./gh.js";

export interface InitOptions {
  allowOgaOverride?: boolean;
}

async function promptUntilValid(prompt: string, validate: (value: string) => string | null): Promise<string> {
  const rl = createInterface({ input, output });
  try {
    while (true) {
      const value = (await rl.question(prompt)).trim();
      const error = validate(value);
      if (!error) return value;
      output.write(`${error}\n`);
    }
  } finally {
    rl.close();
  }
}

function upsertConfig(path: string, nextConfig: InitConfig): void {
  let finalConfig = nextConfig;
  try {
    const existing = JSON.parse(readFileSync(path, "utf8")) as Partial<InitConfig>;
    finalConfig = {
      ...nextConfig,
      ...existing,
      version: 1,
      github: { ...nextConfig.github, ...(existing.github ?? {}) },
      agent: { ...nextConfig.agent, ...(existing.agent ?? {}) },
      registry: { ...nextConfig.registry, ...(existing.registry ?? {}) }
    };
  } catch {
    // no existing config
  }

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(finalConfig, null, 2)}\n`, "utf8");
}

export async function runInit(options: InitOptions = {}): Promise<void> {
  ensureGhAuth();

  const projectContext = await promptUntilValid("Project name/context: ", (v) =>
    v.length > 0 ? null : "Project context is required."
  );

  const repoInput = await promptUntilValid("GitHub repo URL: ", (v) =>
    parseRepoUrl(v) ? null : "Invalid repo URL. Expected: https://github.com/owner/repo"
  );
  const repo = parseRepoUrl(repoInput)!;
  ensureRepoWriteAccess(repo.owner, repo.repo);

  const projectInput = await promptUntilValid("GitHub Project URL: ", (v) =>
    parseProjectUrl(v)
      ? null
      : "Invalid project URL. Expected: https://github.com/users/<owner>/projects/<id> or /orgs/<org>/projects/<id>"
  );
  const project = parseProjectUrl(projectInput)!;
  ensureProjectReadable(project.normalized);

  const roleInput = await promptUntilValid(
    `Agent role (${AGENT_ROLES.join(", ")}) [dev]: `,
    (v) => (v.length === 0 || AGENT_ROLES.includes(v as AgentRole) ? null : "Invalid role.")
  );
  const role: AgentRole = (roleInput || "dev") as AgentRole;

  const viewer = getViewerLogin();
  const registry = ensureRegistryIssue(repo.owner, repo.repo);

  if (role === "oga") {
    const registryBody = getRegistryIssueBody(repo.owner, repo.repo, registry.issueNumber);
    enforceOgaRolePolicy({
      requestedRole: role,
      viewer,
      registryBody,
      allowOgaOverride: options.allowOgaOverride
    });
  }

  const config: InitConfig = {
    version: 1,
    projectContext,
    github: {
      repoUrl: repo.normalized,
      projectUrl: project.normalized
    },
    agent: {
      name: viewer,
      role
    },
    registry
  };

  const outPath = resolve(process.cwd(), ".harambee/config.json");
  upsertConfig(outPath, config);

  output.write(`harambee init complete. Config written: ${outPath}\n`);
}
