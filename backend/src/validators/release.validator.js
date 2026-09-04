import { z } from "zod";

export const createReleaseSchema = z.object({
  body: z.object({
    version: z.string().min(1, "Version is required").max(50),
    title: z.string().min(1, "Release title is required").max(255),
    summary: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    status: z.enum(["draft", "review", "published"]).default("draft"),
    changes: z
      .array(
        z.object({
          category: z.enum(["new", "improved", "fixed"]),
          title: z.string().min(1),
          body: z.string().optional().nullable(),
          displayOrder: z.number().int().default(0),
        })
      )
      .optional(),
  }),
});

export const updateReleaseSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    summary: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    status: z.enum(["draft", "review", "published"]).optional(),
  }),
});

export const createReleaseChangeSchema = z.object({
  body: z.object({
    category: z.enum(["new", "improved", "fixed"]),
    title: z.string().min(1, "Change title is required").max(255),
    body: z.string().optional().nullable(),
    displayOrder: z.number().int().default(0),
  }),
});

export const updateReleaseChangeSchema = z.object({
  body: z.object({
    category: z.enum(["new", "improved", "fixed"]).optional(),
    title: z.string().min(1).max(255).optional(),
    body: z.string().optional().nullable(),
    displayOrder: z.number().int().optional(),
  }),
});

export const assignMultipleActivitiesSchema = z.object({
  body: z.object({
    activityIds: z.array(z.union([z.string(), z.number()])).min(1, "At least one activity ID required"),
  }),
});
