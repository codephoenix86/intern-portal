import { z } from "zod";
export declare const publicStudentsListQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    q: z.ZodOptional<z.ZodString>;
    college: z.ZodOptional<z.ZodString>;
    branch: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    skills: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string[] | undefined, string | undefined>>;
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
export declare const publicStudentParamsSchema: z.ZodObject<{
    studentId: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=public-students.validator.d.ts.map