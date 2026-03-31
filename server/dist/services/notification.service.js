import { Notification, } from "../models/notification.js";
// ── Service Class ────────────────────────────────────
class NotificationService {
    /**
     * Create a single notification
     */
    async create(input) {
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
    async createBulk(input) {
        if (input.userIds.length === 0)
            return [];
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
    async notifySessionScheduled(data) {
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
    async notifySessionCancelled(data) {
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
    async getByUserId(userId, page = 1, limit = 20, unreadOnly = false) {
        const skip = (page - 1) * limit;
        const filter = { userId };
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
    async markAsRead(notificationId, userId) {
        return Notification.findOneAndUpdate({ _id: notificationId, userId }, { read: true, readAt: new Date() }, { new: true });
    }
    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId) {
        return Notification.updateMany({ userId, read: false }, { read: true, readAt: new Date() });
    }
    /**
     * Get unread count
     */
    async getUnreadCount(userId) {
        return Notification.countDocuments({ userId, read: false });
    }
    /**
     * Delete a notification
     */
    async delete(notificationId, userId) {
        return Notification.findOneAndDelete({
            _id: notificationId,
            userId,
        });
    }
    /**
     * Delete all read notifications for a user
     */
    async deleteAllRead(userId) {
        return Notification.deleteMany({
            userId,
            read: true,
        });
    }
}
// ── Export Singleton ──────────────────────────────────
export const notificationService = new NotificationService();
//# sourceMappingURL=notification.service.js.map