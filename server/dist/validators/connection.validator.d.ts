import { z } from "zod";
export declare const sendFriendRequestSchema: z.ZodObject<{
    toUserId: z.ZodString;
}, z.core.$strip>;
export declare const respondFriendRequestSchema: z.ZodObject<{
    connectionId: z.ZodString;
    action: z.ZodEnum<{
        accept: "accept";
        reject: "reject";
    }>;
}, z.core.$strip>;
export declare const followUserSchema: z.ZodObject<{
    toUserId: z.ZodString;
}, z.core.$strip>;
export declare const unfollowUserSchema: z.ZodObject<{
    toUserId: z.ZodString;
}, z.core.$strip>;
export declare const removeFriendSchema: z.ZodObject<{
    toUserId: z.ZodString;
}, z.core.$strip>;
export declare const connectionListQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    q: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=connection.validator.d.ts.map