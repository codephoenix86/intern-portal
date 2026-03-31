import { type Types } from "mongoose";
export type JobWorkType = "Remote" | "Hybrid" | "On-site";
export interface IJob {
    _id: Types.ObjectId;
    recruiterId: Types.ObjectId | null;
    title: string;
    company: string;
    location: string;
    workType: JobWorkType;
    duration: string;
    stipend: string;
    skills: string[];
    description: string;
    requirements: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Job: import("mongoose").Model<IJob, {}, {}, {}, import("mongoose").Document<unknown, {}, IJob, {}, import("mongoose").DefaultSchemaOptions> & IJob & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IJob>;
//# sourceMappingURL=job.model.d.ts.map