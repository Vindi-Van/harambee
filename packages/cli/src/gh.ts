import { execFileSync } from "node:child_process";

function runGh(args: string[]): string {
  return execFileSync("gh", args, { encoding: "utf8" }).trim();
}

export function ensureGhAuth(): void {
  try {
    runGh(["auth", "status"]);
  } catch {
    throw new Error("GitHub auth missing. Run: gh auth login");
  }
}

export function ensureRepoWriteAccess(owner: string, repo: string): void {
  const out = runGh(["api", `repos/${owner}/${repo}`, "--jq", ".permissions.push // false"]);
  if (out !== "true") {
    throw new Error(`Repo write access required for ${owner}/${repo}.`);
  }
}

export function ensureProjectReadable(projectUrl: string): void {
  try {
    runGh(["project", "view", projectUrl, "--format", "json"]);
  } catch {
    throw new Error(`Project is inaccessible: ${projectUrl}`);
  }
}

export function getViewerLogin(): string {
  return runGh(["api", "user", "--jq", ".login"]);
}

export function ensureRegistryIssue(owner: string, repo: string): { issueNumber: number; issueUrl: string } {
  const query = "[.[] | select(.title == \"[HARAMBEE] Agent Role Registry (Canonical)\") | select([.labels[].name] | index(\"harambee-registry\"))][0]";
  const existing = runGh([
    "issue",
    "list",
    "--repo",
    `${owner}/${repo}`,
    "--state",
    "open",
    "--limit",
    "100",
    "--json",
    "number,title,url,labels",
    "--jq",
    query
  ]);

  if (existing && existing !== "null") {
    const parsed = JSON.parse(existing) as { number: number; url: string };
    return { issueNumber: parsed.number, issueUrl: parsed.url };
  }

  const body = `## Policy\n- One active OgaArchitect per repo.\n- Default role for new agents is \`dev\`.\n- Role changes are logged in this issue.\n\n## Active Agents\n| Agent | Role | Status | Updated At |\n|---|---|---|---|\n\n## Change Log\n`;

  const created = runGh([
    "issue",
    "create",
    "--repo",
    `${owner}/${repo}`,
    "--title",
    "[HARAMBEE] Agent Role Registry (Canonical)",
    "--label",
    "harambee-registry",
    "--label",
    "do-not-close",
    "--body",
    body,
    "--json",
    "number,url"
  ]);

  const parsed = JSON.parse(created) as { number: number; url: string };
  return { issueNumber: parsed.number, issueUrl: parsed.url };
}
