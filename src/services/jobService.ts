const API_BASE = "/api";

export const jobService = {
  getJobs: async (filters?: { keyword?: string; location?: string; skills?: string[] }) => {
    return { data: [] };
  },
  getRecommended: async () => {
    return { data: [] };
  },
  getJobById: async (id: string) => {
    return { data: null };
  },
  postJob: async (data: any) => {
    return { data: { id: "new-job" } };
  },
};
