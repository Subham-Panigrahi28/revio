import { z } from "zod";

export const createWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Workspace name must be at least 2 characters").max(100),
    slug: z
      .string()
      .min(2, "Slug must be at least 2 characters")
      .max(100)
      .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    url: z.string().url("Invalid URL format").optional().nullable(),
    widgetSettings: z
      .object({
        theme: z.enum(["dark", "light", "auto"]).default("dark"),
        accentColor: z.string().default("#FF7442"),
        mode: z.enum(["floating", "inline", "popover"]).default("floating"),
      })
      .optional(),
  }),
});

export const updateWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    slug: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
      .optional(),
    url: z.string().url("Invalid URL format").optional().nullable(),
    apiKey: z.string().optional().nullable(),
    webhookSecret: z.string().optional().nullable(),
    widgetSettings: z
      .object({
        theme: z.enum(["dark", "light", "auto"]).optional(),
        accentColor: z.string().optional(),
        mode: z.enum(["floating", "inline", "popover"]).optional(),
      })
      .optional(),
  }),
});

export const addMemberSchema = z.object({
  body: z.object({
    email: z.string().email("Valid email address required"),
    role: z.enum(["admin", "member"]).default("member"),
  }),
});

export const updateMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(["admin", "member"]),
  }),
});
