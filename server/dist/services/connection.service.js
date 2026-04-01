import { Connection } from "../models/connection.model.js";
import { User } from "../models/user.model.js";
import { notificationService } from "../services/notification.service.js";
import { AppError } from "../services/auth.service.js";
function escapeRegex(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
class ConnectionService {
    /* ──────────────────── FRIEND REQUEST (two-way) ──────────────────── */
    async sendFriendRequest(fromUserId, toUserId) {
        if (fromUserId === toUserId) {
            throw new AppError(400, "Cannot send friend request to yourself");
        }
        // Verify target is a student
        const toUser = await User.findOne({
            _id: toUserId,
            role: "student",
            isActive: true,
        })
            .select("name")
            .lean();
        if (!toUser) {
            throw new AppError(404, "Student not found");
        }
        // Check if connection already exists in either direction
        const existing = await Connection.findOne({
            type: "friend",
            $or: [
                { fromUser: fromUserId, toUser: toUserId },
                { fromUser: toUserId, toUser: fromUserId },
            ],
        }).lean();
        if (existing) {
            if (existing.status === "accepted") {
                throw new AppError(400, "Already friends");
            }
            if (existing.status === "pending") {
                throw new AppError(400, "Friend request already pending");
            }
            if (existing.status === "rejected") {
                // Allow re-sending after rejection — update existing
                await Connection.findByIdAndUpdate(existing._id, {
                    fromUser: fromUserId,
                    toUser: toUserId,
                    status: "pending",
                });
                // Notify
                await notificationService.create({
                    userId: toUserId,
                    title: "Friend Request",
                    message: `You have a new friend request`,
                    type: "general",
                });
                return { status: "pending", message: "Friend request sent" };
            }
        }
        await Connection.create({
            fromUser: fromUserId,
            toUser: toUserId,
            type: "friend",
            status: "pending",
        });
        // Notify target
        await notificationService.create({
            userId: toUserId,
            title: "Friend Request",
            message: `You have a new friend request`,
            type: "general",
        });
        return { status: "pending", message: "Friend request sent" };
    }
    async respondToFriendRequest(userId, connectionId, action) {
        const conn = await Connection.findOne({
            _id: connectionId,
            toUser: userId,
            type: "friend",
            status: "pending",
        });
        if (!conn) {
            throw new AppError(404, "Friend request not found");
        }
        conn.status = action === "accept" ? "accepted" : "rejected";
        await conn.save();
        // Notify sender
        const actionText = action === "accept" ? "accepted" : "declined";
        await notificationService.create({
            userId: conn.fromUser.toString(),
            title: "Friend Request Update",
            message: `Your friend request was ${actionText}`,
            type: "general",
        });
        return {
            status: conn.status,
            message: `Friend request ${actionText}`,
        };
    }
    async removeFriend(userId, targetUserId) {
        const result = await Connection.findOneAndDelete({
            type: "friend",
            status: "accepted",
            $or: [
                { fromUser: userId, toUser: targetUserId },
                { fromUser: targetUserId, toUser: userId },
            ],
        });
        if (!result) {
            throw new AppError(404, "Friendship not found");
        }
        return { message: "Friend removed" };
    }
    async cancelFriendRequest(userId, targetUserId) {
        const result = await Connection.findOneAndDelete({
            fromUser: userId,
            toUser: targetUserId,
            type: "friend",
            status: "pending",
        });
        if (!result) {
            throw new AppError(404, "Pending request not found");
        }
        return { message: "Friend request cancelled" };
    }
    /* ──────────────────── FOLLOW (one-way) ──────────────────── */
    async followUser(fromUserId, toUserId) {
        if (fromUserId === toUserId) {
            throw new AppError(400, "Cannot follow yourself");
        }
        // Target must be recruiter or mentor
        const toUser = await User.findOne({
            _id: toUserId,
            role: { $in: ["recruiter", "mentor"] },
            isActive: true,
        })
            .select("role name")
            .lean();
        if (!toUser) {
            throw new AppError(404, "User not found");
        }
        const existing = await Connection.findOne({
            fromUser: fromUserId,
            toUser: toUserId,
            type: "follow",
        }).lean();
        if (existing) {
            throw new AppError(400, "Already following this user");
        }
        await Connection.create({
            fromUser: fromUserId,
            toUser: toUserId,
            type: "follow",
            status: "accepted", // follows are immediate
        });
        return { message: `Now following` };
    }
    async unfollowUser(fromUserId, toUserId) {
        const result = await Connection.findOneAndDelete({
            fromUser: fromUserId,
            toUser: toUserId,
            type: "follow",
        });
        if (!result) {
            throw new AppError(404, "Not following this user");
        }
        return { message: "Unfollowed" };
    }
    /* ──────────────────── QUERIES ──────────────────── */
    /** Get friend status between current user and target */
    async getFriendStatus(userId, targetUserId) {
        const conn = await Connection.findOne({
            type: "friend",
            $or: [
                { fromUser: userId, toUser: targetUserId },
                { fromUser: targetUserId, toUser: userId },
            ],
        }).lean();
        if (!conn)
            return { status: "none" };
        if (conn.status === "accepted") {
            return { status: "accepted", connectionId: conn._id.toString() };
        }
        if (conn.status === "pending") {
            if (conn.fromUser.toString() === userId) {
                return { status: "pending_sent", connectionId: conn._id.toString() };
            }
            return { status: "pending_received", connectionId: conn._id.toString() };
        }
        return { status: "none" };
    }
    /** Check if userId follows targetUserId */
    async getFollowStatus(userId, targetUserId) {
        const conn = await Connection.findOne({
            fromUser: userId,
            toUser: targetUserId,
            type: "follow",
            status: "accepted",
        }).lean();
        return !!conn;
    }
    /** Get bulk connection statuses for a list of user IDs */
    async getBulkFriendStatuses(userId, targetUserIds) {
        const conns = await Connection.find({
            type: "friend",
            $or: [
                { fromUser: userId, toUser: { $in: targetUserIds } },
                { fromUser: { $in: targetUserIds }, toUser: userId },
            ],
        }).lean();
        const result = {};
        // Initialize all as none
        for (const id of targetUserIds) {
            result[id] = { status: "none" };
        }
        for (const conn of conns) {
            const from = conn.fromUser.toString();
            const to = conn.toUser.toString();
            const targetId = from === userId ? to : from;
            if (conn.status === "accepted") {
                result[targetId] = {
                    status: "accepted",
                    connectionId: conn._id.toString(),
                };
            }
            else if (conn.status === "pending") {
                result[targetId] = {
                    status: from === userId ? "pending_sent" : "pending_received",
                    connectionId: conn._id.toString(),
                };
            }
        }
        return result;
    }
    async getBulkFollowStatuses(userId, targetUserIds) {
        const conns = await Connection.find({
            fromUser: userId,
            toUser: { $in: targetUserIds },
            type: "follow",
            status: "accepted",
        }).lean();
        const result = {};
        for (const id of targetUserIds) {
            result[id] = false;
        }
        for (const conn of conns) {
            result[conn.toUser.toString()] = true;
        }
        return result;
    }
    /** List friends (accepted) */
    async listFriends(userId, input) {
        const skip = (input.page - 1) * input.limit;
        // Get all accepted friend connection IDs
        const friendConns = await Connection.find({
            type: "friend",
            status: "accepted",
            $or: [{ fromUser: userId }, { toUser: userId }],
        })
            .select("fromUser toUser")
            .lean();
        const friendIds = friendConns.map((c) => {
            const from = c.fromUser.toString();
            return from === userId ? c.toUser : c.fromUser;
        });
        if (friendIds.length === 0) {
            return {
                items: [],
                page: input.page,
                limit: input.limit,
                total: 0,
                totalPages: 1,
            };
        }
        const filter = {
            _id: { $in: friendIds },
            isActive: true,
        };
        if (input.q) {
            filter["name"] = new RegExp(escapeRegex(input.q), "i");
        }
        const [total, docs] = await Promise.all([
            User.countDocuments(filter),
            User.find(filter)
                .sort({ name: 1 })
                .skip(skip)
                .limit(input.limit)
                .select("name avatar college branch location bio studentSkills")
                .lean(),
        ]);
        const items = docs.map((u) => ({
            id: u._id.toString(),
            name: u.name,
            avatar: u.avatar,
            college: u.college,
            branch: u.branch,
            location: u.location,
            bio: u.bio,
            studentSkills: u.studentSkills ?? [],
        }));
        const totalPages = Math.max(1, Math.ceil(total / input.limit));
        return { items, page: input.page, limit: input.limit, total, totalPages };
    }
    /** List pending friend requests received */
    async listPendingRequests(userId, input) {
        const skip = (input.page - 1) * input.limit;
        const filter = {
            toUser: userId,
            type: "friend",
            status: "pending",
        };
        const [total, conns] = await Promise.all([
            Connection.countDocuments(filter),
            Connection.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(input.limit)
                .populate("fromUser", "name avatar college branch location")
                .lean(),
        ]);
        const items = conns.map((c) => {
            const from = c.fromUser;
            return {
                connectionId: c._id.toString(),
                id: from._id.toString(),
                name: from.name,
                avatar: from.avatar ?? null,
                college: from.college ?? null,
                branch: from.branch ?? null,
                location: from.location ?? null,
                sentAt: c.createdAt.toISOString(),
            };
        });
        const totalPages = Math.max(1, Math.ceil(total / input.limit));
        return { items, page: input.page, limit: input.limit, total, totalPages };
    }
    /** List followed recruiters */
    async listFollowingRecruiters(userId, input) {
        return this._listFollowing(userId, "recruiter", input);
    }
    /** List followed mentors */
    async listFollowingMentors(userId, input) {
        return this._listFollowing(userId, "mentor", input);
    }
    async _listFollowing(userId, role, input) {
        const skip = (input.page - 1) * input.limit;
        const followConns = await Connection.find({
            fromUser: userId,
            type: "follow",
            status: "accepted",
        })
            .select("toUser")
            .lean();
        const followedIds = followConns.map((c) => c.toUser);
        if (followedIds.length === 0) {
            return {
                items: [],
                page: input.page,
                limit: input.limit,
                total: 0,
                totalPages: 1,
            };
        }
        const filter = {
            _id: { $in: followedIds },
            role,
            isActive: true,
        };
        if (input.q) {
            const rx = new RegExp(escapeRegex(input.q), "i");
            if (role === "recruiter") {
                filter["$or"] = [{ name: rx }, { companyName: rx }];
            }
            else {
                filter["name"] = rx;
            }
        }
        const selectFields = role === "recruiter"
            ? "name avatar companyName companyEmail location bio"
            : "name avatar bio expertise";
        const [total, docs] = await Promise.all([
            User.countDocuments(filter),
            User.find(filter)
                .sort({ name: 1 })
                .skip(skip)
                .limit(input.limit)
                .select(selectFields)
                .lean(),
        ]);
        const items = docs.map((u) => {
            const base = {
                id: u._id.toString(),
                name: u.name,
                avatar: u.avatar,
            };
            if (role === "recruiter") {
                base.companyName = u.companyName;
                base.location = u.location;
                base.bio = u.bio;
            }
            else {
                base.bio = u.bio;
                base.expertise = u.expertise ?? [];
            }
            return base;
        });
        const totalPages = Math.max(1, Math.ceil(total / input.limit));
        return { items, page: input.page, limit: input.limit, total, totalPages };
    }
}
export const connectionService = new ConnectionService();
//# sourceMappingURL=connection.service.js.map