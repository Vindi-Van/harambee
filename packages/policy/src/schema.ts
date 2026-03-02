import { z } from "zod";

/**
 * Zod schema for runtime policy validation.
 */
export const policySchema = z.object({
  roles: z.object({
    ogaArchitect: z.object({
      enabled: z.boolean()
    }),
    reviewerWorker: z.object({
      requiredForPrMerge: z.boolean()
    })
  }),
  approval: z.object({
    allPrsRequireHumanApproval: z.boolean(),
    criticalPrsRequireHumanApproval: z.boolean(),
    criticality: z.object({
      complexityThreshold: z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5)
      ]),
      labels: z.array(z.string().min(1))
    })
  }),
  fixWindow: z.object({
    defaultMinutes: z.number().int().min(0),
    maxNewTasksDuringWindow: z.number().int().min(0),
    reassignToSameAgent: z.boolean()
  }),
  assignment: z.object({
    ackTimeoutMin: z.number().int().min(1),
    staleTimeoutMin: z.number().int().min(1),
    maxTasksPerWorker: z.number().int().min(1),
    ogaAssignsTasksOnly: z.boolean()
  }),
  workflow: z.object({
    enforceArtifactGates: z.boolean(),
    enforceIndependentReviewer: z.boolean(),
    decomposeComplexityAtOrAbove: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5)
    ])
  }),
  communication: z.object({
    canonicalSurface: z.literal("github"),
    useDiscussions: z.boolean(),
    mirrorExternalDecisionsToIssueComments: z.boolean()
  })
});

export type PolicySchema = z.infer<typeof policySchema>;
