import { z } from "zod";

export const jobListQuerySchema = z.object({
  keyword: z.string().optional(),
  location: z.string().optional(),
  skills: z
    .string()
    .optional()
    .transform((s) => (s ? s.split(",").map((x) => x.trim()).filter(Boolean) : undefined)),
  sort: z.enum(["newest", "match"]).optional().default("newest"),
});

export const updateStudentProfileSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  phone: z.string().trim().max(20).optional().nullable(),
  studentSkills: z.array(z.string().trim().min(1)).max(50).optional(),
});

export const parseResumeBodySchema = z.object({
  fileUrl: z.string().url(),
});
