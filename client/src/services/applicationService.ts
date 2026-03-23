const API_BASE = "/api";

export const applicationService = {
  getApplications: async () => {
    return { data: [] };
  },
  apply: async (jobId: string) => {
    return { data: { applicationId: "new-app" } };
  },
  getApplicants: async (jobId: string) => {
    return { data: [] };
  },
  updateStatus: async (applicationId: string, status: string) => {
    return { data: { status } };
  },
  uploadResume: async (file: File) => {
    return { data: { url: "mock-url" } };
  },
  parseResume: async (fileUrl: string) => {
    return { data: {} };
  },
  getMatchScore: async (studentId: string, jobId: string) => {
    return { data: { score: 85 } };
  },
};
