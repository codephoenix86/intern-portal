import { type Types } from "mongoose";
export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string | null;
    role: "student" | "mentor" | "recruiter";
    avatar: string | null;
    provider: "local" | "google" | "github";
    providerId: string | null;
    phone: string | null;
    college: string | null;
    branch: string | null;
    location: string | null;
    cgpa: string | null;
    semester: string | null;
    experienceSummary: string | null;
    studentSkills: string[];
    studentProjects: string[];
    achievements: string[];
    targetJobRole: string | null;
    targetSalary: number | null;
    targetCompanies: string[];
    codingProfiles: {
        leetcode: string | null;
        codechef: string | null;
        codeforces: string | null;
        github: string | null;
        linkedin: string | null;
        portfolio: string | null;
    };
    resumeUrl: string | null;
    parsedResume: Record<string, unknown> | null;
    profileViews: number;
    roadmapTasks: Array<{
        id: string;
        title: string;
        category: string;
        completed: boolean;
    }>;
    roadmapInterests: string[];
    expertise: string[];
    bio: string | null;
    companyName: string | null;
    companyEmail: string | null;
    profileCompletion: number;
    isVerified: boolean;
    isActive: boolean;
    lastLoginAt: Date | null;
    lastLoginIp: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=user.model.d.ts.map