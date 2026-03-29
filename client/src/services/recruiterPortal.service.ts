import api from "@/lib/axios";
import type { JobCard } from "@/services/studentPortal.service";

type ApiEnvelope<T> = { success: boolean; message: string; data: T };

async function unwrap<T>(p: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const { data } = await p;
  return data.data;
}

export interface RecruiterDashboardData {
  recruiter: {
    activeListings: number;
    totalApplicants: number;
    shortlisted: number;
    interviewsScheduled: number;
  };
  statusBreakdown: { name: string; value: number }[];
}

export interface RecruiterApplicant {
  id: number;
  applicationId: string;
  name: string;
  email: string;
  appliedFor: string;
  matchScore: number;
  skills: string[];
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  status: string;
  resumeUrl: string | null;
}

export interface RecruiterJob extends JobCard {
  isActive: boolean;
}

export interface RecruiterNotification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: "success" | "info";
}

export interface RecruiterNotificationsPageData {
  notifications: RecruiterNotification[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

export const getRecruiterDashboard = () =>
  unwrap<RecruiterDashboardData>(api.get("/recruiter/dashboard"));

export const listRecruiterJobs = () =>
  unwrap<{ jobs: RecruiterJob[] }>(api.get("/recruiter/jobs"));

export interface CreateRecruiterJobPayload {
  title: string;
  company: string;
  location: string;
  type: "remote" | "onsite" | "hybrid";
  duration: string;
  stipend: string;
  /** Comma-separated or string[] — API accepts both */
  skills: string | string[];
  description: string;
  requirements?: string[];
}

export const createRecruiterJob = (payload: CreateRecruiterJobPayload) =>
  unwrap<{ jobId: string }>(api.post("/recruiter/jobs", payload));

export const listRecruiterApplicants = (status?: string) => {
  const q =
    status && status !== "all"
      ? `?status=${encodeURIComponent(status)}`
      : "";
  return unwrap<{ applicants: RecruiterApplicant[] }>(
    api.get(`/recruiter/applicants${q}`),
  );
};

export const patchRecruiterApplication = (
  applicationId: string,
  status: string,
) =>
  unwrap<{ applicationId: string; status: string }>(
    api.patch(`/recruiter/applications/${applicationId}`, { status }),
  );

export const listRecruiterNotifications = (page = 1, limit = 20) =>
  unwrap<RecruiterNotificationsPageData>(
    api.get(`/recruiter/notifications?page=${page}&limit=${limit}`),
  );

export const markRecruiterNotificationRead = (id: string) =>
  unwrap<unknown>(api.patch(`/recruiter/notifications/${id}/read`));

export const markAllRecruiterNotificationsRead = () =>
  unwrap<unknown>(api.post("/recruiter/notifications/read-all"));
