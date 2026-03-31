import api from "@/lib/axios";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/* ────────────────────────────── Types ────────────────────────────── */

export type PublicRecruiterCard = {
  id: string;
  name: string;
  avatar?: string;
  companyName?: string;
  companyEmail?: string;
  location?: string;
  bio?: string;
  profileCompletion: number;
  updatedAt: string;
};

export type PublicRecruiterJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  workType: string;
  duration: string;
  stipend: string;
  skills: string[];
  postedDate: string;
};

export type PublicRecruiterProfile = PublicRecruiterCard & {
  activeListings: PublicRecruiterJob[];
};

export type PublicRecruitersListResponse = {
  items: PublicRecruiterCard[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PublicRecruiterProfileResponse = {
  recruiter: PublicRecruiterProfile;
};

export type PublicRecruitersListParams = {
  page?: number;
  limit?: number;
  q?: string;
  company?: string;
  location?: string;
  sort?: "updatedAt" | "name" | "profileCompletion";
  order?: "asc" | "desc";
};

/* ────────────────────────────── API Calls ────────────────────────── */

export const publicRecruitersService = {
  list: async (
    params?: PublicRecruitersListParams,
  ): Promise<PublicRecruitersListResponse> => {
    const { data } = await api.get<ApiEnvelope<PublicRecruitersListResponse>>(
      "/recruiters",
      { params },
    );
    return data.data;
  },

  getById: async (
    recruiterId: string,
  ): Promise<PublicRecruiterProfileResponse> => {
    const { data } = await api.get<ApiEnvelope<PublicRecruiterProfileResponse>>(
      `/recruiters/${recruiterId}`,
    );
    return data.data;
  },
};
