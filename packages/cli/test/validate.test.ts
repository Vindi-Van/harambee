import { describe, expect, it } from "vitest";
import { parseProjectUrl, parseRepoUrl } from "../src/validate.js";

describe("parseRepoUrl", () => {
  it("accepts canonical github repo urls", () => {
    expect(parseRepoUrl("https://github.com/Vindi-Van/harambee")).toEqual({
      owner: "Vindi-Van",
      repo: "harambee",
      normalized: "https://github.com/Vindi-Van/harambee"
    });
  });

  it("rejects non-github urls", () => {
    expect(parseRepoUrl("https://gitlab.com/org/repo")).toBeNull();
  });
});

describe("parseProjectUrl", () => {
  it("accepts user project urls", () => {
    expect(parseProjectUrl("https://github.com/users/octocat/projects/5")).toEqual({
      normalized: "https://github.com/users/octocat/projects/5"
    });
  });

  it("accepts org project urls", () => {
    expect(parseProjectUrl("https://github.com/orgs/acme/projects/12")).toEqual({
      normalized: "https://github.com/orgs/acme/projects/12"
    });
  });

  it("rejects invalid urls", () => {
    expect(parseProjectUrl("https://github.com/octocat/hello-world")).toBeNull();
  });
});
