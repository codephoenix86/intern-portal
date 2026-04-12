import { z } from "zod";
export declare const jobListQuerySchema: z.ZodObject<{
    keyword: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    skills: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string[] | undefined, string | undefined>>;
    sort: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        match: "match";
        newest: "newest";
    }>>>;
}, z.core.$strip>;
export declare const updateStudentProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatar: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    college: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    branch: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    cgpa: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    semester: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    experienceSummary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    studentSkills: z.ZodOptional<z.ZodArray<z.ZodString>>;
    studentProjects: z.ZodOptional<z.ZodArray<z.ZodString>>;
    achievements: z.ZodOptional<z.ZodArray<z.ZodString>>;
    targetJobRole: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    targetSalary: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    targetCompanies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    codingProfiles: z.ZodOptional<z.ZodObject<{
        leetcode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        codechef: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        codeforces: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        github: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        linkedin: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        portfolio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const parseResumeBodySchema: z.ZodObject<{
    fileUrl: z.ZodString;
}, z.core.$strip>;
export declare const catalogCourseListQuerySchema: z.ZodObject<{
    keyword: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
//# sourceMappingURL=student.validator.d.ts.map