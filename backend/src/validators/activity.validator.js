import { z } from "zod";

export const createActivitySchema = z.object({
  body: z.object({
    type: z.enum(["pull_request", "commit", "release_tag"]).default("pull_request"),
    externalId: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional().nullable(),
    url: z.string().url().optional().nullable(),
    authorName: z.string().optional().nullable(),
    occurredAt: z.string().datetime().optional().nullable(),
    isIgnored: z.boolean().default(false),
    ignoreReason: z.string().optional().nullable(),
    trustBadge: z.string().default("High confidence"),
    branch: z.string().optional().nullable(),
    commitsCount: z.number().int().min(1).default(1),
    metadata: z.record(z.any()).default({}),
  }),
});

export const updateActivitySchema = z.object({
  body: z.object({
    isIgnored: z.boolean().optional(),
    ignoreReason: z.string().optional().nullable(),
    trustBadge: z.string().optional(),
  }),
});

export const assignActivitySchema = z.object({
  body: z.object({
    releaseId: z.string().or(z.number()),
  }),
});
