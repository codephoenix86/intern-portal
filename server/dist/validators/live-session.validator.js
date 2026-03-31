import { z } from "zod";
// ── Create Session Schema ────────────────────────────
export const createSessionSchema = z.object({
    topic: z
        .string()
        .min(1, "Topic is required")
        .trim()
        .min(3, "Topic must be at least 3 characters")
        .max(200, "Topic must not exceed 200 characters"),
    date: z.string().min(1, "Date is required").trim(),
    time: z.string().min(1, "Time is required").trim(),
    type: z
        .enum(["free_demo", "paid_class"])
        .describe("Session type is required"),
    courseId: z
        .string()
        .optional()
        .nullable()
        .transform((val) => val || null),
    description: z
        .string()
        .max(2000, "Description must not exceed 2000 characters")
        .optional()
        .default(""),
    maxAttendees: z
        .number()
        .int()
        .min(1, "Must allow at least 1 attendee")
        .max(1000, "Max 1000 attendees")
        .optional()
        .default(100),
});
// ── Update Session Schema ────────────────────────────
export const updateSessionSchema = z.object({
    topic: z
        .string()
        .trim()
        .min(3, "Topic must be at least 3 characters")
        .max(200, "Topic must not exceed 200 characters")
        .optional(),
    date: z.string().trim().min(1, "Date is required").optional(),
    time: z.string().trim().min(1, "Time is required").optional(),
    type: z.enum(["free_demo", "paid_class"]).optional(),
    description: z.string().max(2000).optional(),
    maxAttendees: z.number().int().min(1).max(1000).optional(),
    isCompleted: z.boolean().optional(),
});
// ── Query Params Schema ──────────────────────────────
export const sessionQuerySchema = z.object({
    page: z.string().optional().default("1").transform(Number),
    limit: z.string().optional().default("10").transform(Number),
    type: z.enum(["free_demo", "paid_class", "all"]).optional().default("all"),
    status: z.enum(["upcoming", "completed", "all"]).optional().default("all"),
});
// Student listing: GET /api/sessions/available
export const availableSessionsQuerySchema = z.object({
    page: z.string().optional().default("1").transform(Number),
    limit: z.string().optional().default("20").transform(Number),
    type: z.enum(["free_demo", "paid_class", "all"]).optional().default("all"),
});
//# sourceMappingURL=live-session.validator.js.map