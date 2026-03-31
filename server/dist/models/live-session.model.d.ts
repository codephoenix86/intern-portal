import { type Types, type Document } from "mongoose";
export interface ILiveSession {
    _id: Types.ObjectId;
    mentorId: Types.ObjectId;
    courseId: Types.ObjectId | null;
    topic: string;
    description: string;
    date: string;
    time: string;
    scheduledAt: Date;
    duration: number;
    type: "free_demo" | "paid_class";
    link: string | null;
    accessCode: string | null;
    maxAttendees: number;
    attendeeCount: number;
    attendees: Types.ObjectId[];
    status: "scheduled" | "live" | "completed" | "cancelled";
    isCompleted: boolean;
    completedAt: Date | null;
    cancelledAt: Date | null;
    cancelReason: string | null;
    recordingUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface ILiveSessionMethods {
    isFull(): boolean;
    hasStudentJoined(studentId: string): boolean;
    markAsLive(): Promise<ILiveSessionDocument>;
    markAsCompleted(): Promise<ILiveSessionDocument>;
    markAsCancelled(reason: string): Promise<ILiveSessionDocument>;
}
export type ILiveSessionDocument = Document & ILiveSession & ILiveSessionMethods;
export declare const LiveSession: import("mongoose").Model<ILiveSession, {}, {}, {}, Document<unknown, {}, ILiveSession, {}, import("mongoose").DefaultSchemaOptions> & ILiveSession & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILiveSession>;
//# sourceMappingURL=live-session.model.d.ts.map