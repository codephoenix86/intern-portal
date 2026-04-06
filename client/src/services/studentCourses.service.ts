import api from "@/lib/axios";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PlatformCourseCard {
  id: string;
  title: string;
  shortDescription: string;
  level: string;
  duration: string;
  category: string;
  skills: string[];
  thumbnailUrl: string | null;
  enrollmentCount: number;
  pricing: {
    amount: number;
    currency: string;
    discountedAmount: number;
  };
  enrolled: boolean;
}

export interface PlatformCourseModule {
  id?: string;
  title: string;
  duration: string;
  contentType: string;
  isFree: boolean;
  order: number;
}

export interface PlatformCourseDetail {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  level: string;
  duration: string;
  category: string;
  skills: string[];
  thumbnailUrl: string | null;
  previewVideoUrl: string | null;
  modules: PlatformCourseModule[];
  pricing: {
    amount: number;
    currency: string;
    discountPercent: number;
    discountedAmount: number;
  };
  enrollmentCount: number;
  mentorName: string;
}

export interface PlatformEnrollmentRow {
  id: string;
  courseId: string;
  title: string;
  shortDescription: string;
  level: string;
  duration: string;
  category: string;
  skills: string[];
  thumbnailUrl: string | null;
  progress: number;
  status: string;
  enrolledAt: string;
}

export const studentCoursesService = {
  listCatalog: async (params?: {
    keyword?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    courses: PlatformCourseCard[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const { data } = await api.get<
      ApiEnvelope<{
        courses: PlatformCourseCard[];
        total: number;
        page: number;
        totalPages: number;
      }>
    >("/student/catalog/courses", {
      params: {
        keyword: params?.keyword,
        category: params?.category,
        page: params?.page,
        limit: params?.limit,
      },
    });
    return data.data;
  },

  getCourse: async (
    courseId: string,
  ): Promise<{
    course: PlatformCourseDetail;
    enrolled: boolean;
    enrollment: { id: string; progress: number; status: string } | null;
  }> => {
    const { data } = await api.get<
      ApiEnvelope<{
        course: PlatformCourseDetail;
        enrolled: boolean;
        enrollment: { id: string; progress: number; status: string } | null;
      }>
    >(`/student/catalog/courses/${courseId}`);
    return data.data;
  },

  enroll: async (courseId: string): Promise<{ enrollmentId: string }> => {
    const { data } = await api.post<ApiEnvelope<{ enrollmentId: string }>>(
      `/student/catalog/courses/${courseId}/enroll`,
    );
    return data.data;
  },

  unenroll: async (courseId: string): Promise<void> => {
    await api.delete(`/student/catalog/courses/${courseId}/enroll`);
  },

  listMyEnrollments: async (): Promise<PlatformEnrollmentRow[]> => {
    const { data } = await api.get<
      ApiEnvelope<{ enrollments: PlatformEnrollmentRow[] }>
    >("/student/enrollments");
    return data.data.enrollments;
  },
};
