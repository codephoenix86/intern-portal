import api from "@/lib/axios";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/* ────────────────────────────── Types ────────────────────────────── */

export type FriendStatus =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "accepted";

export type FriendStatusMap = Record<
  string,
  { status: FriendStatus; connectionId?: string }
>;

export type FollowStatusMap = Record<string, boolean>;

export type FriendItem = {
  id: string;
  name: string;
  avatar?: string | null;
  college?: string | null;
  branch?: string | null;
  location?: string | null;
  bio?: string | null;
  studentSkills: string[];
};

export type PendingRequestItem = {
  connectionId: string;
  id: string;
  name: string;
  avatar?: string | null;
  college?: string | null;
  branch?: string | null;
  location?: string | null;
  sentAt: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/* ────────────────────────────── API Calls ────────────────────────── */

export const connectionService = {
  // ── Friends (two-way) ──

  sendFriendRequest: async (toUserId: string) => {
    const { data } = await api.post<
      ApiEnvelope<{ status: string; message: string }>
    >("/connections/friends/request", { toUserId });
    return data.data;
  },

  respondFriendRequest: async (
    connectionId: string,
    action: "accept" | "reject",
  ) => {
    const { data } = await api.post<
      ApiEnvelope<{ status: string; message: string }>
    >("/connections/friends/respond", { connectionId, action });
    return data.data;
  },

  removeFriend: async (toUserId: string) => {
    const { data } = await api.post<ApiEnvelope<{ message: string }>>(
      "/connections/friends/remove",
      { toUserId },
    );
    return data.data;
  },

  cancelFriendRequest: async (toUserId: string) => {
    const { data } = await api.post<ApiEnvelope<{ message: string }>>(
      "/connections/friends/cancel",
      { toUserId },
    );
    return data.data;
  },

  listFriends: async (params?: {
    page?: number;
    limit?: number;
    q?: string;
  }) => {
    const { data } = await api.get<ApiEnvelope<PaginatedResponse<FriendItem>>>(
      "/connections/friends",
      { params },
    );
    return data.data;
  },

  listPendingRequests: async (params?: { page?: number; limit?: number }) => {
    const { data } = await api.get<
      ApiEnvelope<PaginatedResponse<PendingRequestItem>>
    >("/connections/friends/pending", { params });
    return data.data;
  },

  getBulkFriendStatuses: async (ids: string[]): Promise<FriendStatusMap> => {
    if (ids.length === 0) return {};
    const { data } = await api.get<ApiEnvelope<FriendStatusMap>>(
      "/connections/friends/statuses",
      { params: { ids: ids.join(",") } },
    );
    return data.data;
  },

  // ── Follow (one-way) ──

  followUser: async (toUserId: string) => {
    const { data } = await api.post<ApiEnvelope<{ message: string }>>(
      "/connections/follow",
      { toUserId },
    );
    return data.data;
  },

  unfollowUser: async (toUserId: string) => {
    const { data } = await api.post<ApiEnvelope<{ message: string }>>(
      "/connections/unfollow",
      { toUserId },
    );
    return data.data;
  },

  listFollowingRecruiters: async (params?: {
    page?: number;
    limit?: number;
    q?: string;
  }) => {
    const { data } = await api.get<
      ApiEnvelope<PaginatedResponse<Record<string, unknown>>>
    >("/connections/following/recruiters", { params });
    return data.data;
  },

  listFollowingMentors: async (params?: {
    page?: number;
    limit?: number;
    q?: string;
  }) => {
    const { data } = await api.get<
      ApiEnvelope<PaginatedResponse<Record<string, unknown>>>
    >("/connections/following/mentors", { params });
    return data.data;
  },

  getBulkFollowStatuses: async (ids: string[]): Promise<FollowStatusMap> => {
    if (ids.length === 0) return {};
    const { data } = await api.get<ApiEnvelope<FollowStatusMap>>(
      "/connections/following/statuses",
      { params: { ids: ids.join(",") } },
    );
    return data.data;
  },
};
