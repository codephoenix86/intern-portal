import { z } from "zod";
const mongoObjectIdSchema = z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
export const sendFriendRequestSchema = z.object({
    toUserId: mongoObjectIdSchema,
});
export const respondFriendRequestSchema = z.object({
    connectionId: mongoObjectIdSchema,
    action: z.enum(["accept", "reject"]),
});
export const followUserSchema = z.object({
    toUserId: mongoObjectIdSchema,
});
export const unfollowUserSchema = z.object({
    toUserId: mongoObjectIdSchema,
});
export const removeFriendSchema = z.object({
    toUserId: mongoObjectIdSchema,
});
export const connectionListQuerySchema = z.object({
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
});
//# sourceMappingURL=connection.validator.js.map