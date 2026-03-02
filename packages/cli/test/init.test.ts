import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const answers: string[] = [];
const ghMocks = {
  ensureGhAuth: vi.fn(),
  ensureRepoWriteAccess: vi.fn(),
  ensureProjectReadable: vi.fn(),
  getViewerLogin: vi.fn(() => "matrim"),
  ensureRegistryIssue: vi.fn(() => ({ issueNumber: 42, issueUrl: "https://github.com/acme/repo/issues/42" })),
  getRegistryIssueBody: vi.fn(() => ""),
  enforceOgaRolePolicy: vi.fn()
};

vi.mock("node:readline/promises", () => ({
  createInterface: () => ({
    question: vi.fn(async () => answers.shift() ?? ""),
    close: vi.fn()
  })
}));

vi.mock("../src/gh.js", () => ghMocks);

describe("runInit", () => {
  const originalCwd = process.cwd();
  let workdir = "";
  let stdoutSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    answers.length = 0;
    workdir = mkdtempSync(join(tmpdir(), "harambee-init-test-"));
    process.chdir(workdir);
    stdoutSpy = vi.spyOn(process.stdout, "write").mockReturnValue(true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    process.chdir(originalCwd);
  });

  it("is idempotent and preserves existing config values while merging", async () => {
    const configDir = join(workdir, ".harambee");
    const configPath = join(configDir, "config.json");
    mkdirSync(configDir, { recursive: true });
    writeFileSync(
      configPath,
      `${JSON.stringify(
        {
          version: 1,
          projectContext: "Existing Context",
          github: {
            repoUrl: "https://github.com/existing/repo",
            projectUrl: "https://github.com/users/existing/projects/7"
          },
          agent: {
            name: "existing-agent",
            role: "qa"
          },
          registry: {
            issueNumber: 7,
            issueUrl: "https://github.com/existing/repo/issues/7"
          }
        },
        null,
        2
      )}\n`,
      "utf8"
    );

    answers.push(
      "New Context",
      "https://github.com/new/repo",
      "https://github.com/users/new/projects/1",
      "dev"
    );

    const { runInit } = await import("../src/init.js");
    await runInit();

    const once = readFileSync(configPath, "utf8");
    answers.push(
      "Another Context",
      "https://github.com/another/repo",
      "https://github.com/users/another/projects/9",
      "oga"
    );
    await runInit();
    const twice = readFileSync(configPath, "utf8");

    expect(JSON.parse(twice)).toEqual({
      version: 1,
      projectContext: "Existing Context",
      github: {
        repoUrl: "https://github.com/existing/repo",
        projectUrl: "https://github.com/users/existing/projects/7"
      },
      agent: {
        name: "existing-agent",
        role: "qa"
      },
      registry: {
        issueNumber: 7,
        issueUrl: "https://github.com/existing/repo/issues/7"
      }
    });
    expect(twice).toBe(once);
  });

  it("re-prompts with clear messages for invalid repo and project URLs", async () => {
    answers.push(
      "Project X",
      "not-a-repo-url",
      "https://github.com/acme/repo",
      "https://github.com/acme/repo",
      "https://github.com/users/acme/projects/2",
      "dev"
    );

    const { runInit } = await import("../src/init.js");
    await runInit();

    const output = stdoutSpy.mock.calls.map((c) => String(c[0])).join("\n");
    expect(output).toContain("Invalid repo URL. Expected: https://github.com/owner/repo");
    expect(output).toContain(
      "Invalid project URL. Expected: https://github.com/users/<owner>/projects/<id> or /orgs/<org>/projects/<id>"
    );
  });
});
