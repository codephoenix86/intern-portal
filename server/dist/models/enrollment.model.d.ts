import { Types, type Document } from "mongoose";
export interface IModuleProgress {
    moduleId: Types.ObjectId;
    completed: boolean;
    completedAt: Date | null;
    timeSpent: number;
}
export interface IEnrollment {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    courseId: Types.ObjectId;
    mentorId: Types.ObjectId;
    progress: number;
    moduleProgress: IModuleProgress[];
    lastAccessedAt: Date | null;
    status: "active" | "completed" | "dropped";
    isCompleted: boolean;
    completedAt: Date | null;
    certificateIssued: boolean;
    certificateId: Types.ObjectId | null;
    paymentStatus: "free" | "paid" | "pending" | "refunded";
    paymentAmount: number;
    paymentId: string | null;
    enrolledAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IEnrollmentMethods {
    completeModule(moduleId: string): Promise<IEnrollmentDocument>;
    calculateProgress(totalModules: number): number;
    markCompleted(): Promise<IEnrollmentDocument>;
    drop(): Promise<IEnrollmentDocument>;
}
export type IEnrollmentDocument = Document & IEnrollment & IEnrollmentMethods;
export declare const Enrollment: import("mongoose").Model<IEnrollment, {}, {}, {}, Document<unknown, {}, IEnrollment, {}, import("mongoose").DefaultSchemaOptions> & IEnrollment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IEnrollment>;
//# sourceMappingURL=enrollment.model.d.ts.map