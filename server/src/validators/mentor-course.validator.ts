import { z } from "zod";

export const createMentorCourseSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  shortDescription: z.string().trim().max(300).optional().default(""),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  duration: z.string().trim().min(1).max(120),
  skills: z.array(z.string().trim().min(1)).max(20).optional().default([]),
  category: z.string().trim().min(1).max(120),
  pricing: z
    .object({
      amount: z.number().min(0),
      currency: z.enum(["INR", "USD"]).optional().default("INR"),
      discountPercent: z.number().min(0).max(100).optional().default(0),
    })
    .optional(),
  isPublished: z.boolean().optional().default(false),
});

export const updateMentorCourseSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    shortDescription: z.string().trim().max(300).optional(),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    duration: z.string().trim().min(1).max(120).optional(),
    skills: z.array(z.string().trim().min(1)).max(20).optional(),
    category: z.string().trim().min(1).max(120).optional(),
    pricing: z
      .object({
        amount: z.number().min(0),
        currency: z.enum(["INR", "USD"]).optional(),
        discountPercent: z.number().min(0).max(100).optional(),
      })
      .optional(),
    isPublished: z.boolean().optional(),
    thumbnailUrl: z.string().url().max(2000).nullable().optional(),
    previewVideoUrl: z.string().url().max(2000).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const addCourseModuleSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).optional().default(""),
  contentType: z.enum(["video", "pdf", "notes", "link"]),
  duration: z.string().trim().max(80).optional().default(""),
  isFree: z.boolean().optional().default(false),
  order: z.number().int().min(0).optional(),
});

export const updateCourseModuleSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(1000).optional(),
    contentType: z.enum(["video", "pdf", "notes", "link"]).optional(),
    duration: z.string().trim().max(80).optional(),
    isFree: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
    contentUrl: z.union([z.string().max(2000), z.null()]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
