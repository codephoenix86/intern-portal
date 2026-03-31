import { type Types } from "mongoose";
export declare const APPLICATION_STATUSES: readonly ["Applied", "Screening", "Interview", "Offer", "Rejected"];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
export interface IApplication {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    jobId: Types.ObjectId;
    status: ApplicationStatus;
    matchScore: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Application: import("mongoose").Model<IApplication, {}, {}, {}, import("mongoose").Document<unknown, {}, IApplication, {}, import("mongoose").DefaultSchemaOptions> & IApplication & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IApplication>;
//# sourceMappingURL=application.model.d.ts.map