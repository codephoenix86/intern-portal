import { z } from "zod";
export declare const publicMentorsListQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    q: z.ZodOptional<z.ZodString>;
    expertise: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string[] | undefined, string | undefined>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        name: "name";
        profileCompletion: "profileCompletion";
        updatedAt: "updatedAt";
    }>>>;
    order: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
}, z.core.$strip>;
export declare const publicMentorParamsSchema: z.ZodObject<{
    mentorId: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=public-mentors.validator.d.ts.map