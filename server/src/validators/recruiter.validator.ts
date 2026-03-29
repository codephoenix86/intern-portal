import { z } from "zod";

export const createRecruiterJobSchema = z.object({
  title: z.string().trim().min(1).max(200),
  company: z.string().trim().min(1).max(120),
  location: z.string().trim().min(1).max(120),
  type: z.enum(["remote", "onsite", "hybrid"]),
  duration: z.string().trim().min(1).max(64),
  stipend: z.string().trim().min(1).max(64),
  skills: z
    .union([
      z.array(z.string().trim().min(1)),
      z.string().transform((s) =>
        s
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      ),
    ])
    .pipe(z.array(z.string()).min(1).max(50)),
  description: z.string().trim().min(1).max(8000),
  requirements: z.array(z.string().trim().min(1)).max(50).optional(),
});

export const updateRecruiterJobSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    company: z.string().trim().min(1).max(120).optional(),
    location: z.string().trim().min(1).max(120).optional(),
    type: z.enum(["remote", "onsite", "hybrid"]).optional(),
    duration: z.string().trim().min(1).max(64).optional(),
    stipend: z.string().trim().min(1).max(64).optional(),
    skills: z.array(z.string().trim().min(1)).min(1).max(50).optional(),
    description: z.string().trim().min(1).max(8000).optional(),
    requirements: z.array(z.string().trim().min(1)).max(50).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const patchRecruiterApplicationSchema = z.object({
  status: z.enum([
    "Pending",
    "Shortlisted",
    "Interview",
    "Accepted",
    "Rejected",
  ]),
});

export const recruiterProfilePatchSchema = z.object({
  companyName: z.string().trim().max(120).optional(),
  companyEmail: z.string().email().max(120).optional().nullable(),
});

export const applicantsQuerySchema = z.object({
  status: z.string().optional(),
});
