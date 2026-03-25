import { Schema, model, type Types, type Document } from "mongoose";

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
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

// ── Priority ─────────────────────────────────────────
export const NOTIFICATION_PRIORITIES = [
  "low",
  "medium",
  "high",
  "urgent",
] as const;
export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number];

// ── Interface ────────────────────────────────────────
export interface INotification {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Recipient

  // Content
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;

  // Status
  read: boolean;
  readAt: Date | null;

  // Navigation
  link: string | null; // Frontend deep link
  actionLabel: string | null; // e.g. "View Application"

  // Metadata
  metadata: Record<string, unknown>; // Extra data (courseId, sessionId, etc.)
  senderId: Types.ObjectId | null; // Who triggered this notification
  senderName: string | null; // Cached sender name

  // Expiry
  expiresAt: Date | null; // Auto-delete after this date

  createdAt: Date;
}

// ── Methods ──────────────────────────────────────────
export interface INotificationMethods {
  markAsRead(): Promise<INotificationDocument>;
}

export type INotificationDocument = Document &
  INotification &
  INotificationMethods;

// ── Schema ───────────────────────────────────────────
const notificationSchema = new Schema<INotification, any, INotificationMethods>(
  {
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(_doc, ret) {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  },
);

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
notificationSchema.statics.createNotification = async function (data: {
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
  expiresAt?: Date;
}) {
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
notificationSchema.statics.createBulk = async function (
  userIds: Array<Types.ObjectId | string>,
  data: {
    title: string;
    message: string;
    type: NotificationType;
    priority?: NotificationPriority;
    link?: string;
    actionLabel?: string;
    metadata?: Record<string, unknown>;
    senderId?: Types.ObjectId | string;
    senderName?: string;
  },
) {
  if (userIds.length === 0) return [];

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
notificationSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { expiresAt: { $ne: null } },
  },
);

// Auto-delete old read notifications after 90 days
notificationSchema.index(
  { readAt: 1 },
  {
    expireAfterSeconds: 90 * 24 * 60 * 60,
    partialFilterExpression: { read: true, readAt: { $ne: null } },
  },
);

// ── Export ───────────────────────────────────────────
export const Notification = model<INotification>(
  "Notification",
  notificationSchema,
);
