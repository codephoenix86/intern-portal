import api from "@/lib/axios";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export type PublicStudentCard = {
  id: string;
  name: string;
  avatar?: string;
  college?: string;
  branch?: string;
  location?: string;
  bio?: string;
  experienceSummary?: string;
  studentSkills: string[];
  studentProjects: string[];
  achievements: string[];
  codingProfiles?: {
    leetcode?: string;
    codechef?: string;
    codeforces?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  profileCompletion: number;
  updatedAt: string;
};

export type PublicStudentsListResponse = {
  items: PublicStudentCard[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PublicStudentsListParams = {
  page?: number;
  limit?: number;
  q?: string;
  college?: string;
  branch?: string;
  location?: string;
  skills?: string[];
  sort?: "updatedAt" | "name" | "profileCompletion";
  order?: "asc" | "desc";
};

export const publicStudentsService = {
  list: async (params?: PublicStudentsListParams): Promise<PublicStudentsListResponse> => {
    const { data } = await api.get<ApiEnvelope<PublicStudentsListResponse>>("/students", {
      params: {
        ...params,
        skills: params?.skills && params.skills.length > 0 ? params.skills : undefined,
      },
    });

    return data.data;
  },
};

