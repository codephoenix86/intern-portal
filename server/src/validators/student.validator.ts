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
  avatar: z.string().trim().url().max(1000).optional().nullable(),
  bio: z.string().trim().max(500).optional().nullable(),
  college: z.string().trim().max(200).optional().nullable(),
  branch: z.string().trim().max(120).optional().nullable(),
  location: z.string().trim().max(120).optional().nullable(),
  cgpa: z.string().trim().max(10).optional().nullable(),
  semester: z.string().trim().max(50).optional().nullable(),
  experienceSummary: z.string().trim().max(2000).optional().nullable(),
  studentSkills: z.array(z.string().trim().min(1)).max(50).optional(),
  studentProjects: z.array(z.string().trim().min(1)).max(20).optional(),
  achievements: z.array(z.string().trim().min(1)).max(30).optional(),
  codingProfiles: z
    .object({
      leetcode: z.string().trim().max(1000).optional().nullable(),
      codechef: z.string().trim().max(1000).optional().nullable(),
      codeforces: z.string().trim().max(1000).optional().nullable(),
      github: z.string().trim().max(1000).optional().nullable(),
      linkedin: z.string().trim().max(1000).optional().nullable(),
      portfolio: z.string().trim().max(1000).optional().nullable(),
    })
    .optional(),
});

export const parseResumeBodySchema = z.object({
  fileUrl: z.string().url(),
});
