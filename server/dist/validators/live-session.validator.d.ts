import { z } from "zod";
export declare const createSessionSchema: z.ZodObject<{
    topic: z.ZodString;
    date: z.ZodString;
    time: z.ZodString;
    type: z.ZodEnum<{
        free_demo: "free_demo";
        paid_class: "paid_class";
    }>;
    courseId: z.ZodPipe<z.ZodNullable<z.ZodOptional<z.ZodString>>, z.ZodTransform<string | null, string | null | undefined>>;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    maxAttendees: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const updateSessionSchema: z.ZodObject<{
    topic: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    time: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        free_demo: "free_demo";
        paid_class: "paid_class";
    }>>;
    description: z.ZodOptional<z.ZodString>;
    maxAttendees: z.ZodOptional<z.ZodNumber>;
    isCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const sessionQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodDefault<z.ZodOptional<z.ZodString>>, z.ZodTransform<number, string>>;
    limit: z.ZodPipe<z.ZodDefault<z.ZodOptional<z.ZodString>>, z.ZodTransform<number, string>>;
    type: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        free_demo: "free_demo";
        paid_class: "paid_class";
        all: "all";
    }>>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        completed: "completed";
        all: "all";
        upcoming: "upcoming";
    }>>>;
}, z.core.$strip>;
export declare const availableSessionsQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodDefault<z.ZodOptional<z.ZodString>>, z.ZodTransform<number, string>>;
    limit: z.ZodPipe<z.ZodDefault<z.ZodOptional<z.ZodString>>, z.ZodTransform<number, string>>;
    type: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        free_demo: "free_demo";
        paid_class: "paid_class";
        all: "all";
    }>>>;
}, z.core.$strip>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type SessionQueryInput = z.infer<typeof sessionQuerySchema>;
export type AvailableSessionsQueryInput = z.infer<typeof availableSessionsQuerySchema>;
//# sourceMappingURL=live-session.validator.d.ts.map