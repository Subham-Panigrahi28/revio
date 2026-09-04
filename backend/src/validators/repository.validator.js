import { z } from "zod";

export const createRepositorySchema = z.object({
  body: z.object({
    githubRepoId: z.number().int().positive("GitHub repository ID must be a positive number"),
    name: z.string().min(1).max(255),
    fullName: z.string().min(1).max(255),
    defaultBranch: z.string().min(1).max(255).default("main"),
  }),
});
