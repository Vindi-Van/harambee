/**
 * Runtime policy model for Harambee orchestration.
 */
export interface PolicyConfig {
  roles: {
    ogaArchitect: {
      enabled: boolean;
    };
    reviewerWorker: {
      requiredForPrMerge: boolean;
    };
  };
  approval: {
    allPrsRequireHumanApproval: boolean;
    criticalPrsRequireHumanApproval: boolean;
    criticality: {
      complexityThreshold: 1 | 2 | 3 | 4 | 5;
      labels: string[];
    };
  };
  fixWindow: {
    defaultMinutes: number;
    maxNewTasksDuringWindow: number;
    reassignToSameAgent: boolean;
  };
  assignment: {
    ackTimeoutMin: number;
    staleTimeoutMin: number;
    maxTasksPerWorker: number;
    ogaAssignsTasksOnly: boolean;
  };
  workflow: {
    enforceArtifactGates: boolean;
    enforceIndependentReviewer: boolean;
    decomposeComplexityAtOrAbove: 1 | 2 | 3 | 4 | 5;
  };
  communication: {
    canonicalSurface: "github";
    useDiscussions: boolean;
    mirrorExternalDecisionsToIssueComments: boolean;
  };
}
