import api from "@/lib/axios";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/* ────────────────────────────── Types ────────────────────────────── */

export type PublicMentorCard = {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  expertise: string[];
  profileCompletion: number;
  updatedAt: string;
};

export type PublicMentorCourse = {
  id: string;
  title: string;
  shortDescription: string;
  level: string;
  duration: string;
  skills: string[];
  category: string;
  enrollmentCount: number;
  averageRating: number;
  isFree: boolean;
  slug: string;
};

export type PublicMentorSession = {
  id: string;
  topic: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: string;
  maxAttendees: number;
  attendeeCount: number;
};

export type PublicMentorProfile = PublicMentorCard & {
  courses: PublicMentorCourse[];
  upcomingSessions: PublicMentorSession[];
};

export type PublicMentorsListResponse = {
  items: PublicMentorCard[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PublicMentorProfileResponse = {
  mentor: PublicMentorProfile;
};

export type PublicMentorsListParams = {
  page?: number;
  limit?: number;
  q?: string;
  expertise?: string[];
  sort?: "updatedAt" | "name" | "profileCompletion";
  order?: "asc" | "desc";
};

/* ────────────────────────────── API Calls ────────────────────────── */

export const publicMentorsService = {
  list: async (
    params?: PublicMentorsListParams,
  ): Promise<PublicMentorsListResponse> => {
    const { data } = await api.get<ApiEnvelope<PublicMentorsListResponse>>(
      "/mentors",
      {
        params: {
          ...params,
          expertise:
            params?.expertise && params.expertise.length > 0
              ? params.expertise.join(",")
              : undefined,
        },
      },
    );
    return data.data;
  },

  getById: async (mentorId: string): Promise<PublicMentorProfileResponse> => {
    const { data } = await api.get<ApiEnvelope<PublicMentorProfileResponse>>(
      `/mentors/${mentorId}`,
    );
    return data.data;
  },
};
