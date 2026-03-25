import {
  Notification,
  type NotificationType,
  type NotificationPriority,
} from "../models/notification.js";
import type { Types } from "mongoose";

// ── Types ────────────────────────────────────────────

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

// ── Service Class ────────────────────────────────────

class NotificationService {
  /**
   * Create a single notification
   */
  async create(input: CreateNotificationInput) {
    const notification = await Notification.create({
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      priority: input.priority ?? "medium",
      link: input.link ?? null,
      actionLabel: input.actionLabel ?? null,
      metadata: input.metadata ?? {},
      senderId: input.senderId ?? null,
      senderName: input.senderName ?? null,
    });

    // TODO: Emit Socket.io event for real-time notification
    // io.to(input.userId.toString()).emit('notification:new', notification)

    return notification;
  }

  /**
   * Create notifications for multiple users
   */
  async createBulk(input: BulkNotificationInput) {
    if (input.userIds.length === 0) return [];

    const notifications = input.userIds.map((userId) => ({
      userId,
      title: input.title,
      message: input.message,
      type: input.type,
      priority: input.priority ?? "medium",
      link: input.link ?? null,
      actionLabel: input.actionLabel ?? null,
      metadata: input.metadata ?? {},
      senderId: input.senderId ?? null,
      senderName: input.senderName ?? null,
      read: false,
    }));

    const created = await Notification.insertMany(notifications);

    // TODO: Emit Socket.io events for real-time notifications
    // input.userIds.forEach((userId) => {
    //   io.to(userId.toString()).emit('notification:new', { title, message })
    // })

    return created;
  }

  /**
   * Notify students about a session
   */
  async notifySessionScheduled(data: {
    studentIds: string[];
    mentorId: string;
    mentorName: string;
    sessionId: string;
    topic: string;
    date: string;
    time: string;
    type: "free_demo" | "paid_class";
  }) {
    const typeLabel = data.type === "free_demo" ? "Free Demo" : "Live Class";

    return this.createBulk({
      userIds: data.studentIds,
      title: `New ${typeLabel} Scheduled`,
      message: `📅 ${data.mentorName} scheduled "${data.topic}" on ${data.date} at ${data.time}`,
      type: "session_scheduled",
      priority: "high",
      link: `/student/sessions/${data.sessionId}`,
      actionLabel: "View Session",
      metadata: {
        sessionId: data.sessionId,
        mentorId: data.mentorId,
      },
      senderId: data.mentorId,
      senderName: data.mentorName,
    });
  }

  /**
   * Notify students about session cancellation
   */
  async notifySessionCancelled(data: {
    studentIds: string[];
    mentorName: string;
    topic: string;
    reason: string;
  }) {
    return this.createBulk({
      userIds: data.studentIds,
      title: "Session Cancelled",
      message: `❌ ${data.mentorName} cancelled "${data.topic}". Reason: ${data.reason}`,
      type: "session_cancelled",
      priority: "high",
    });
  }

  /**
   * Get notifications for a user with pagination
   */
  async getByUserId(userId: string, page = 1, limit = 20, unreadOnly = false) {
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = { userId };

    if (unreadOnly) {
      filter["read"] = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId, read: false }),
    ]);

    return {
      notifications,
      total,
      unreadCount,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true, readAt: new Date() },
      { new: true },
    );
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    return Notification.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() },
    );
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({ userId, read: false });
  }

  /**
   * Delete a notification
   */
  async delete(notificationId: string, userId: string) {
    return Notification.findOneAndDelete({
      _id: notificationId,
      userId,
    });
  }

  /**
   * Delete all read notifications for a user
   */
  async deleteAllRead(userId: string) {
    return Notification.deleteMany({
      userId,
      read: true,
    });
  }
}

// ── Export Singleton ──────────────────────────────────
export const notificationService = new NotificationService();
