import { type Types, type Document } from "mongoose";
export interface IModule {
    title: string;
    description: string;
    contentUrl: string | null;
    contentType: "video" | "pdf" | "notes" | "link";
    duration: string;
    order: number;
    isFree: boolean;
}
export interface IPricing {
    amount: number;
    currency: string;
    discountPercent: number;
    discountedAmount: number;
}
export interface ICourse {
    _id: Types.ObjectId;
    mentorId: Types.ObjectId;
    title: string;
    description: string;
    shortDescription: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    duration: string;
    skills: string[];
    category: string;
    modules: IModule[];
    thumbnailUrl: string | null;
    previewVideoUrl: string | null;
    pricing: IPricing;
    isPublished: boolean;
    publishedAt: Date | null;
    enrollmentCount: number;
    completionCount: number;
    averageRating: number;
    totalRatings: number;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICourseMethods {
    isFree(): boolean;
    publish(): Promise<ICourseDocument>;
    unpublish(): Promise<ICourseDocument>;
    incrementEnrollment(): Promise<ICourseDocument>;
}
export type ICourseDocument = Document & ICourse & ICourseMethods;
export declare const Course: import("mongoose").Model<ICourse, {}, {}, {}, Document<unknown, {}, ICourse, {}, import("mongoose").DefaultSchemaOptions> & ICourse & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICourse>;
//# sourceMappingURL=course.model.d.ts.map