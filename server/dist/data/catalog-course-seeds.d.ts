/**
 * Minimal published courses used when the DB has no published catalog entries
 * but at least one mentor exists. `mentorId` is set at seed time.
 */
export declare const CATALOG_COURSE_SEED_TEMPLATES: ({
    title: string;
    description: string;
    shortDescription: string;
    level: "Beginner";
    duration: string;
    skills: string[];
    category: string;
    modules: {
        title: string;
        description: string;
        contentUrl: null;
        contentType: "video";
        duration: string;
        order: number;
        isFree: boolean;
    }[];
    thumbnailUrl: null;
    previewVideoUrl: null;
    pricing: {
        amount: number;
        currency: "INR";
        discountPercent: number;
        discountedAmount: number;
    };
    enrollmentCount: number;
    completionCount: number;
    averageRating: number;
    totalRatings: number;
} | {
    title: string;
    description: string;
    shortDescription: string;
    level: "Intermediate";
    duration: string;
    skills: string[];
    category: string;
    modules: ({
        title: string;
        description: string;
        contentUrl: null;
        contentType: "notes";
        duration: string;
        order: number;
        isFree: boolean;
    } | {
        title: string;
        description: string;
        contentUrl: null;
        contentType: "video";
        duration: string;
        order: number;
        isFree: boolean;
    })[];
    thumbnailUrl: null;
    previewVideoUrl: null;
    pricing: {
        amount: number;
        currency: "INR";
        discountPercent: number;
        discountedAmount: number;
    };
    enrollmentCount: number;
    completionCount: number;
    averageRating: number;
    totalRatings: number;
})[];
//# sourceMappingURL=catalog-course-seeds.d.ts.map