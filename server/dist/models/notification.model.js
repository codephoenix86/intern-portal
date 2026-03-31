import { Schema, model } from "mongoose";
// ── Constants ────────────────────────────────────────
export const NOTIFICATION_TYPES = [
    "application_update", // Student: application status changed
    "new_applicant", // Recruiter: new application received
    "interview_scheduled", // Student: interview scheduled
    "session_scheduled", // Student: mentor scheduled a class
    "session_reminder", // Student: session starting soon
    "session_cancelled", // Student: session cancelled
    "course_update", // Student: new module added / course updated
    "course_enrolled", // Mentor: student enrolled in course
    "certificate_issued", // Student: certificate issued
    "assignment_created", // Student: new assignment
    "assignment_graded", // Student: assignment graded
    "submission_received", // Mentor: student submitted assignment
    "message_received", // Both: new message
    "reminder", // Generic reminder
    "system", // System notification
    "general", // General
];
// ── Priority ─────────────────────────────────────────
export const NOTIFICATION_PRIORITIES = [
    "low",
    "medium",
    "high",
    "urgent",
];
// ── Schema ───────────────────────────────────────────
const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
    // ── Content ──
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: 200,
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        maxlength: 1000,
    },
    type: {
        type: String,
        enum: {
            values: NOTIFICATION_TYPES,
            message: "Invalid notification type",
        },
        default: "general",
    },
    priority: {
        type: String,
        enum: NOTIFICATION_PRIORITIES,
        default: "medium",
    },
    // ── Status ──
    read: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date,
        default: null,
    },
    // ── Navigation ──
    link: {
        type: String,
        default: null,
    },
    actionLabel: {
        type: String,
        default: null,
        maxlength: 50,
    },
    // ── Metadata ──
    metadata: {
        type: Schema.Types.Mixed,
        default: {},
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    senderName: {
        type: String,
        default: null,
    },
    // ── Expiry ──
    expiresAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
        transform(_doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
});
// ── Instance Methods ─────────────────────────────────
notificationSchema.methods.markAsRead = async function () {
    this.read = true;
    this.readAt = new Date();
    return this.save();
};
// ── Statics ──────────────────────────────────────────
/**
 * Create a single notification
 */
notificationSchema.statics.createNotification = async function (data) {
    return this.create({
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority ?? "medium",
        link: data.link ?? null,
        actionLabel: data.actionLabel ?? null,
        metadata: data.metadata ?? {},
        senderId: data.senderId ?? null,
        senderName: data.senderName ?? null,
        expiresAt: data.expiresAt ?? null,
    });
};
/**
 * Bulk create notifications
 */
notificationSchema.statics.createBulk = async function (userIds, data) {
    if (userIds.length === 0)
        return [];
    const notifications = userIds.map((userId) => ({
        userId,
        title: data.title,
        message: data.message,
        type: data.type,
        priority: data.priority ?? "medium",
        link: data.link ?? null,
        actionLabel: data.actionLabel ?? null,
        metadata: data.metadata ?? {},
        senderId: data.senderId ?? null,
        senderName: data.senderName ?? null,
        read: false,
    }));
    return this.insertMany(notifications);
};
// ── Indexes ──────────────────────────────────────────
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ priority: 1 });
// TTL: Auto-delete expired notifications
notificationSchema.index({ expiresAt: 1 }, {
    expireAfterSeconds: 0,
    partialFilterExpression: { expiresAt: { $ne: null } },
});
// Auto-delete old read notifications after 90 days
notificationSchema.index({ readAt: 1 }, {
    expireAfterSeconds: 90 * 24 * 60 * 60,
    partialFilterExpression: { read: true, readAt: { $ne: null } },
});
// ── Export ───────────────────────────────────────────
export const Notification = model("Notification", notificationSchema);
//# sourceMappingURL=notification.model.js.map