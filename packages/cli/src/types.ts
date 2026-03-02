export const AGENT_ROLES = ["oga", "dev", "qa", "reviewer", "devops", "ui"] as const;
export type AgentRole = (typeof AGENT_ROLES)[number];

export interface InitConfig {
  version: 1;
  projectContext: string;
  github: {
    repoUrl: string;
    projectUrl: string;
  };
  agent: {
    name: string;
    role: AgentRole;
  };
  registry: {
    issueNumber: number;
    issueUrl: string;
  };
}
