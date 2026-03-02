export function parseRepoUrl(input: string): { owner: string; repo: string; normalized: string } | null {
  const value = input.trim();
  const match = value.match(/^https:\/\/github\.com\/([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/i);
  if (!match) return null;
  const owner = match[1];
  const repo = match[2];
  return { owner, repo, normalized: `https://github.com/${owner}/${repo}` };
}

export function parseProjectUrl(input: string): { normalized: string } | null {
  const value = input.trim();
  const orgProject = value.match(/^https:\/\/github\.com\/orgs\/([^/\s]+)\/projects\/(\d+)\/?$/i);
  if (orgProject) {
    return { normalized: `https://github.com/orgs/${orgProject[1]}/projects/${orgProject[2]}` };
  }

  const userProject = value.match(/^https:\/\/github\.com\/users\/([^/\s]+)\/projects\/(\d+)\/?$/i);
  if (userProject) {
    return { normalized: `https://github.com/users/${userProject[1]}/projects/${userProject[2]}` };
  }

  return null;
}
