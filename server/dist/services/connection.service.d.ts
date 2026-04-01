declare class ConnectionService {
    sendFriendRequest(fromUserId: string, toUserId: string): Promise<{
        status: string;
        message: string;
    }>;
    respondToFriendRequest(userId: string, connectionId: string, action: "accept" | "reject"): Promise<{
        status: "rejected" | "accepted";
        message: string;
    }>;
    removeFriend(userId: string, targetUserId: string): Promise<{
        message: string;
    }>;
    cancelFriendRequest(userId: string, targetUserId: string): Promise<{
        message: string;
    }>;
    followUser(fromUserId: string, toUserId: string): Promise<{
        message: string;
    }>;
    unfollowUser(fromUserId: string, toUserId: string): Promise<{
        message: string;
    }>;
    /** Get friend status between current user and target */
    getFriendStatus(userId: string, targetUserId: string): Promise<{
        status: "none" | "pending_sent" | "pending_received" | "accepted";
        connectionId?: string;
    }>;
    /** Check if userId follows targetUserId */
    getFollowStatus(userId: string, targetUserId: string): Promise<boolean>;
    /** Get bulk connection statuses for a list of user IDs */
    getBulkFriendStatuses(userId: string, targetUserIds: string[]): Promise<Record<string, {
        status: "none" | "pending_sent" | "pending_received" | "accepted";
        connectionId?: string;
    }>>;
    getBulkFollowStatuses(userId: string, targetUserIds: string[]): Promise<Record<string, boolean>>;
    /** List friends (accepted) */
    listFriends(userId: string, input: {
        page: number;
        limit: number;
        q?: string | undefined;
    }): Promise<{
        items: {
            id: string;
            name: string;
            avatar: string | null;
            college: string | null;
            branch: string | null;
            location: string | null;
            bio: string | null;
            studentSkills: string[];
        }[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    /** List pending friend requests received */
    listPendingRequests(userId: string, input: {
        page: number;
        limit: number;
    }): Promise<{
        items: {
            connectionId: string;
            id: string;
            name: string;
            avatar: string | null;
            college: string | null;
            branch: string | null;
            location: string | null;
            sentAt: string;
        }[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    /** List followed recruiters */
    listFollowingRecruiters(userId: string, input: {
        page: number;
        limit: number;
        q?: string | undefined;
    }): Promise<{
        items: Record<string, unknown>[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    /** List followed mentors */
    listFollowingMentors(userId: string, input: {
        page: number;
        limit: number;
        q?: string | undefined;
    }): Promise<{
        items: Record<string, unknown>[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    private _listFollowing;
}
export declare const connectionService: ConnectionService;
export {};
//# sourceMappingURL=connection.service.d.ts.map