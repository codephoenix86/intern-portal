import { z } from "zod";
export declare const createMentorCourseSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    shortDescription: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    level: z.ZodEnum<{
        Beginner: "Beginner";
        Intermediate: "Intermediate";
        Advanced: "Advanced";
    }>;
    duration: z.ZodString;
    skills: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    category: z.ZodString;
    pricing: z.ZodOptional<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            INR: "INR";
            USD: "USD";
        }>>>;
        discountPercent: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>>;
    isPublished: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const updateMentorCourseSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    shortDescription: z.ZodOptional<z.ZodString>;
    level: z.ZodOptional<z.ZodEnum<{
        Beginner: "Beginner";
        Intermediate: "Intermediate";
        Advanced: "Advanced";
    }>>;
    duration: z.ZodOptional<z.ZodString>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
    category: z.ZodOptional<z.ZodString>;
    pricing: z.ZodOptional<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodOptional<z.ZodEnum<{
            INR: "INR";
            USD: "USD";
        }>>;
        discountPercent: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    thumbnailUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    previewVideoUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const addCourseModuleSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    contentType: z.ZodEnum<{
        link: "link";
        video: "video";
        pdf: "pdf";
        notes: "notes";
    }>;
    duration: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    isFree: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    order: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateCourseModuleSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    contentType: z.ZodOptional<z.ZodEnum<{
        link: "link";
        video: "video";
        pdf: "pdf";
        notes: "notes";
    }>>;
    duration: z.ZodOptional<z.ZodString>;
    isFree: z.ZodOptional<z.ZodBoolean>;
    order: z.ZodOptional<z.ZodNumber>;
    contentUrl: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
}, z.core.$strip>;
//# sourceMappingURL=mentor-course.validator.d.ts.map