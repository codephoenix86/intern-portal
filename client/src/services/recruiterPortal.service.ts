import api from "@/lib/axios";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export type RecruiterDashboardResponse = {
  recruiter: {
    activeListings: number;
    totalApplicants: number;
    shortlisted: number;
    interviewsScheduled: number;
  };
  statusBreakdown: Array<{ name: string; value: number }>;
};

export type RecruiterJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  skills: string[];
  description: string;
  requirements: string[];
  postedDate: string;
  applicants: number;
  isActive: boolean;
};

export type CreateRecruiterJobPayload = {
  title: string;
  company: string;
  location: string;
  type: "remote" | "onsite" | "hybrid";
  duration: string;
  stipend: string;
  skills: string[] | string;
  description: string;
  requirements?: string[];
};

export type UpdateRecruiterJobPayload = Partial<CreateRecruiterJobPayload>;

export const recruiterPortalService = {
  getDashboard: async (): Promise<RecruiterDashboardResponse> => {
    const { data } = await api.get<ApiEnvelope<RecruiterDashboardResponse>>(
      "/recruiter/dashboard",
    );
    return data.data;
  },

  listJobs: async (): Promise<RecruiterJob[]> => {
    const { data } = await api.get<ApiEnvelope<{ jobs: RecruiterJob[] }>>(
      "/recruiter/jobs",
    );
    return data.data.jobs;
  },

  getJob: async (jobId: string): Promise<RecruiterJob> => {
    const { data } = await api.get<ApiEnvelope<{ job: RecruiterJob }>>(
      `/recruiter/jobs/${jobId}`,
    );
    return data.data.job;
  },

  createJob: async (
    payload: CreateRecruiterJobPayload,
  ): Promise<{ jobId: string }> => {
    const { data } = await api.post<ApiEnvelope<{ jobId: string }>>(
      "/recruiter/jobs",
      payload,
    );
    return data.data;
  },

  updateJob: async (
    jobId: string,
    payload: UpdateRecruiterJobPayload,
  ): Promise<{ jobId: string }> => {
    const { data } = await api.patch<ApiEnvelope<{ jobId: string }>>(
      `/recruiter/jobs/${jobId}`,
      payload,
    );
    return data.data;
  },

  closeJob: async (jobId: string): Promise<{ jobId: string }> => {
    const { data } = await api.patch<ApiEnvelope<{ jobId: string }>>(
      `/recruiter/jobs/${jobId}/close`,
    );
    return data.data;
  },
};

