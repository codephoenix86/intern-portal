import { type NotificationType, type NotificationPriority } from "../models/notification.js";
import type { Types } from "mongoose";
interface CreateNotificationInput {
    userId: Types.ObjectId | string;
    title: string;
    message: string;
    type: NotificationType;
    priority?: NotificationPriority;
    link?: string;
    actionLabel?: string;
    metadata?: Record<string, unknown>;
    senderId?: Types.ObjectId | string;
    senderName?: string;
}
interface BulkNotificationInput {
    userIds: Array<Types.ObjectId | string>;
    title: string;
    message: string;
    type: NotificationType;
    priority?: NotificationPriority;
    link?: string;
    actionLabel?: string;
    metadata?: Record<string, unknown>;
    senderId?: Types.ObjectId | string;
    senderName?: string;
}
declare class NotificationService {
    /**
     * Create a single notification
     */
    create(input: CreateNotificationInput): Promise<import("mongoose").Document<unknown, {}, import("../models/notification.model.js").INotification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/notification.model.js").INotification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    /**
     * Create notifications for multiple users
     */
    createBulk(input: BulkNotificationInput): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, import("../models/notification.model.js").INotification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/notification.model.js").INotification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, Omit<{
        userId: string | Types.ObjectId;
        title: string;
        message: string;
        type: "application_update" | "new_applicant" | "interview_scheduled" | "session_scheduled" | "session_reminder" | "session_cancelled" | "course_update" | "course_enrolled" | "certificate_issued" | "assignment_created" | "assignment_graded" | "submission_received" | "message_received" | "reminder" | "system" | "general";
        priority: "low" | "medium" | "high" | "urgent";
        link: string | null;
        actionLabel: string | null;
        metadata: Record<string, unknown>;
        senderId: string | Types.ObjectId | null;
        senderName: string | null;
        read: boolean;
    }, "_id">>[]>;
    /**
     * Notify students about a session
     */
    notifySessionScheduled(data: {
        studentIds: string[];
        mentorId: string;
        mentorName: string;
        sessionId: string;
        topic: string;
        date: string;
        time: string;
        type: "free_demo" | "paid_class";
    }): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, import("../models/notification.model.js").INotification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/notification.model.js").INotification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, Omit<{
        userId: string | Types.ObjectId;
        title: string;
        message: string;
        type: "application_update" | "new_applicant" | "interview_scheduled" | "session_scheduled" | "session_reminder" | "session_cancelled" | "course_update" | "course_enrolled" | "certificate_issued" | "assignment_created" | "assignment_graded" | "submission_received" | "message_received" | "reminder" | "system" | "general";
        priority: "low" | "medium" | "high" | "urgent";
        link: string | null;
        actionLabel: string | null;
        metadata: Record<string, unknown>;
        senderId: string | Types.ObjectId | null;
        senderName: string | null;
        read: boolean;
    }, "_id">>[]>;
    /**
     * Notify students about session cancellation
     */
    notifySessionCancelled(data: {
        studentIds: string[];
        mentorName: string;
        topic: string;
        reason: string;
    }): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, import("../models/notification.model.js").INotification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/notification.model.js").INotification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, Omit<{
        userId: string | Types.ObjectId;
        title: string;
        message: string;
        type: "application_update" | "new_applicant" | "interview_scheduled" | "session_scheduled" | "session_reminder" | "session_cancelled" | "course_update" | "course_enrolled" | "certificate_issued" | "assignment_created" | "assignment_graded" | "submission_received" | "message_received" | "reminder" | "system" | "general";
        priority: "low" | "medium" | "high" | "urgent";
        link: string | null;
        actionLabel: string | null;
        metadata: Record<string, unknown>;
        senderId: string | Types.ObjectId | null;
        senderName: string | null;
        read: boolean;
    }, "_id">>[]>;
    /**
     * Get notifications for a user with pagination
     */
    getByUserId(userId: string, page?: number, limit?: number, unreadOnly?: boolean): Promise<{
        notifications: (import("../models/notification.model.js").INotification & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        unreadCount: number;
        page: number;
        totalPages: number;
    }>;
    /**
     * Mark a notification as read
     */
    markAsRead(notificationId: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/notification.model.js").INotification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/notification.model.js").INotification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    /**
     * Mark all notifications as read for a user
     */
    markAllAsRead(userId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    /**
     * Get unread count
     */
    getUnreadCount(userId: string): Promise<number>;
    /**
     * Delete a notification
     */
    delete(notificationId: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/notification.model.js").INotification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/notification.model.js").INotification & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    /**
     * Delete all read notifications for a user
     */
    deleteAllRead(userId: string): Promise<import("mongodb").DeleteResult>;
}
export declare const notificationService: NotificationService;
export {};
//# sourceMappingURL=notification.service.d.ts.map