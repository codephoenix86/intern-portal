import api from "@/lib/axios";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface StudentApplicationItem {
  id: string;
  internship: string;
  company: string;
  status: "Applied" | "Screening" | "Interview" | "Offer" | "Rejected";
  date: string;
  matchScore: number;
}

export interface RecruiterApplicantItem {
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
  status: "Pending" | "Shortlisted" | "Interview" | "Accepted" | "Rejected";
  resumeUrl: string | null;
}

export const applicationService = {
  getApplications: async (): Promise<StudentApplicationItem[]> => {
    const { data } = await api.get<ApiEnvelope<{ applications: StudentApplicationItem[] }>>(
      "/student/applications",
    );
    return data.data.applications;
  },

  apply: async (jobId: string): Promise<{ applicationId: string }> => {
    const { data } = await api.post<ApiEnvelope<{ applicationId: string }>>(
      `/student/jobs/${jobId}/apply`,
    );
    return data.data;
  },

  getApplicants: async (status = "all"): Promise<RecruiterApplicantItem[]> => {
    const { data } = await api.get<ApiEnvelope<{ applicants: RecruiterApplicantItem[] }>>(
      "/recruiter/applicants",
      { params: { status } },
    );
    return data.data.applicants;
  },

  updateStatus: async (
    applicationId: string,
    status: "Pending" | "Shortlisted" | "Interview" | "Accepted" | "Rejected",
  ): Promise<{ applicationId: string; status: string }> => {
    const { data } = await api.patch<
      ApiEnvelope<{ applicationId: string; status: string }>
    >(`/recruiter/applications/${applicationId}`, { status });
    return data.data;
  },

  uploadResume: async (file: File): Promise<{ url: string; parsedResume: Record<string, unknown> | null }> => {
    const formData = new FormData();
    formData.append("resume", file);

    const { data } = await api.post<
      ApiEnvelope<{ url: string; parsedResume: Record<string, unknown> | null }>
    >("/student/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.data;
  },

  parseResume: async (
    fileUrl: string,
  ): Promise<Record<string, unknown>> => {
    const { data } = await api.post<ApiEnvelope<Record<string, unknown>>>(
      "/student/resume/parse",
      { fileUrl },
    );
    return data.data;
  },

  getMatchScore: async (
    _studentId: string,
    jobId: string,
  ): Promise<{ score: number }> => {
    const { data } = await api.get<ApiEnvelope<{ score: number }>>(
      `/student/jobs/${jobId}/match-score`,
    );
    return data.data;
  },
};
