import { z } from "zod";

const mongoObjectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const publicRecruitersListQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => {
      const n = v ? Number(v) : 1;
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
    }),
  limit: z
    .string()
    .optional()
    .transform((v) => {
      const n = v ? Number(v) : 20;
      const safe = Number.isFinite(n) && n > 0 ? Math.floor(n) : 20;
      return Math.min(Math.max(safe, 1), 50);
    }),
  q: z.string().trim().max(120).optional(),
  company: z.string().trim().max(200).optional(),
  location: z.string().trim().max(120).optional(),
  sort: z
    .enum(["updatedAt", "name", "profileCompletion"])
    .optional()
    .default("updatedAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const publicRecruiterParamsSchema = z.object({
  recruiterId: mongoObjectIdSchema,
});
