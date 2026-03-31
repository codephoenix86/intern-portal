import { z } from "zod";
export declare const createRecruiterJobSchema: z.ZodObject<{
    title: z.ZodString;
    company: z.ZodString;
    location: z.ZodString;
    type: z.ZodEnum<{
        remote: "remote";
        onsite: "onsite";
        hybrid: "hybrid";
    }>;
    duration: z.ZodString;
    stipend: z.ZodString;
    skills: z.ZodPipe<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<string[], string>>]>, z.ZodArray<z.ZodString>>;
    description: z.ZodString;
    requirements: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const updateRecruiterJobSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        remote: "remote";
        onsite: "onsite";
        hybrid: "hybrid";
    }>>;
    duration: z.ZodOptional<z.ZodString>;
    stipend: z.ZodOptional<z.ZodString>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
    requirements: z.ZodOptional<z.ZodArray<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const patchRecruiterApplicationSchema: z.ZodObject<{
    status: z.ZodEnum<{
        Interview: "Interview";
        Rejected: "Rejected";
        Pending: "Pending";
        Shortlisted: "Shortlisted";
        Accepted: "Accepted";
    }>;
}, z.core.$strip>;
export declare const recruiterProfilePatchSchema: z.ZodObject<{
    companyName: z.ZodOptional<z.ZodString>;
    companyEmail: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const applicantsQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=recruiter.validator.d.ts.map