import api from "@/lib/axios";

// ── Types ────────────────────────────────────────────

export interface LiveSession {
  _id: string;
  mentorId: string;
  courseId: { _id: string; title: string } | null;
  topic: string;
  description: string;
  date: string;
  time: string;
  scheduledAt: string;
  duration: number;
  type: "free_demo" | "paid_class";
  link: string | null;
  accessCode: string | null;
  maxAttendees: number;
  attendeeCount: number;
  attendees: string[];
  status: "scheduled" | "live" | "completed" | "cancelled";
  isCompleted: boolean;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  recordingUrl: string | null;
  isUpcoming: boolean;
  spotsLeft: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionPayload {
  topic: string;
  date: string;
  time: string;
  type: "free_demo" | "paid_class";
  courseId?: string | null;
  description?: string;
  maxAttendees?: number;
}

export interface UpdateSessionPayload {
  topic?: string;
  date?: string;
  time?: string;
  type?: "free_demo" | "paid_class";
  description?: string;
  maxAttendees?: number;
  isCompleted?: boolean;
}

export interface SessionsResponse {
  success: boolean;
  message: string;
  data: {
    sessions: LiveSession[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface SessionResponse {
  success: boolean;
  message: string;
  data: {
    session: LiveSession;
  };
}

interface SessionQuery {
  page?: number;
  limit?: number;
  type?: "free_demo" | "paid_class" | "all";
  status?: "upcoming" | "completed" | "all";
}

// ── API Calls ────────────────────────────────────────

export const createSession = async (
  payload: CreateSessionPayload,
): Promise<SessionResponse> => {
  const { data } = await api.post<SessionResponse>("/mentor/sessions", payload);
  return data;
};

export const getMentorSessions = async (
  query: SessionQuery = {},
): Promise<SessionsResponse> => {
  const params = new URLSearchParams();
  if (query.page) params.set("page", query.page.toString());
  if (query.limit) params.set("limit", query.limit.toString());
  if (query.type) params.set("type", query.type);
  if (query.status) params.set("status", query.status);

  const { data } = await api.get<SessionsResponse>(
    `/mentor/sessions?${params.toString()}`,
  );
  return data;
};

export const getSessionById = async (id: string): Promise<SessionResponse> => {
  const { data } = await api.get<SessionResponse>(`/mentor/sessions/${id}`);
  return data;
};

export const updateSession = async (
  id: string,
  payload: UpdateSessionPayload,
): Promise<SessionResponse> => {
  const { data } = await api.put<SessionResponse>(
    `/mentor/sessions/${id}`,
    payload,
  );
  return data;
};

export const completeSessionApi = async (
  id: string,
): Promise<SessionResponse> => {
  const { data } = await api.patch<SessionResponse>(
    `/mentor/sessions/${id}/complete`,
  );
  return data;
};

export const deleteSessionApi = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete(`/mentor/sessions/${id}`);
  return data;
};

export const joinSessionApi = async (
  id: string,
  accessCode?: string,
): Promise<{ success: boolean; message: string; data: { link: string } }> => {
  const { data } = await api.post(`/sessions/${id}/join`, { accessCode });
  return data;
};
