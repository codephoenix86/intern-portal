import { z } from "zod";
export declare const publicRecruitersListQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    q: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
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
export declare const publicRecruiterParamsSchema: z.ZodObject<{
    recruiterId: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=public-recruiters.validator.d.ts.map