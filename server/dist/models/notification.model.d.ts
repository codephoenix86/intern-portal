import { type Types, type Document } from "mongoose";
export declare const NOTIFICATION_TYPES: readonly ["application_update", "new_applicant", "interview_scheduled", "session_scheduled", "session_reminder", "session_cancelled", "course_update", "course_enrolled", "certificate_issued", "assignment_created", "assignment_graded", "submission_received", "message_received", "reminder", "system", "general"];
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
export declare const NOTIFICATION_PRIORITIES: readonly ["low", "medium", "high", "urgent"];
export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number];
export interface INotification {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    read: boolean;
    readAt: Date | null;
    link: string | null;
    actionLabel: string | null;
    metadata: Record<string, unknown>;
    senderId: Types.ObjectId | null;
    senderName: string | null;
    expiresAt: Date | null;
    createdAt: Date;
}
export interface INotificationMethods {
    markAsRead(): Promise<INotificationDocument>;
}
export type INotificationDocument = Document & INotification & INotificationMethods;
export declare const Notification: import("mongoose").Model<INotification, {}, {}, {}, Document<unknown, {}, INotification, {}, import("mongoose").DefaultSchemaOptions> & INotification & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, INotification>;
//# sourceMappingURL=notification.model.d.ts.map