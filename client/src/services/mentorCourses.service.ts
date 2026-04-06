import api from "@/lib/axios";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface MentorCourseSummary {
  id: string;
  title: string;
  shortDescription: string;
  level: string;
  duration: string;
  category: string;
  isPublished: boolean;
  enrollmentCount: number;
  moduleCount: number;
  updatedAt: string;
}

export interface MentorCourseModule {
  id?: string;
  title: string;
  description: string;
  contentUrl: string | null;
  contentType: string;
  duration: string;
  order: number;
  isFree: boolean;
}

export interface MentorCourseDetail {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  level: string;
  duration: string;
  skills: string[];
  category: string;
  thumbnailUrl: string | null;
  previewVideoUrl: string | null;
  pricing: {
    amount: number;
    currency: string;
    discountPercent: number;
    discountedAmount: number;
  };
  isPublished: boolean;
  publishedAt: string | null;
  enrollmentCount: number;
  modules: MentorCourseModule[];
}

export interface EnrolledStudentRow {
  enrollmentId: string;
  studentId: string;
  name: string;
  email: string;
  avatar: string | null;
  progress: number;
  status: string;
  enrolledAt: string;
}

export const mentorCoursesService = {
  list: async (): Promise<MentorCourseSummary[]> => {
    const { data } = await api.get<ApiEnvelope<{ courses: MentorCourseSummary[] }>>(
      "/mentor/courses",
    );
    return data.data.courses;
  },

  get: async (courseId: string): Promise<{ course: MentorCourseDetail }> => {
    const { data } = await api.get<ApiEnvelope<{ course: MentorCourseDetail }>>(
      `/mentor/courses/${courseId}`,
    );
    return data.data;
  },

  create: async (body: {
    title: string;
    description: string;
    shortDescription?: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    duration: string;
    skills?: string[];
    category: string;
    pricing?: { amount: number; currency?: "INR" | "USD"; discountPercent?: number };
    isPublished?: boolean;
  }): Promise<{ courseId: string }> => {
    const { data } = await api.post<ApiEnvelope<{ courseId: string }>>(
      "/mentor/courses",
      body,
    );
    return data.data;
  },

  update: async (
    courseId: string,
    body: Partial<{
      title: string;
      description: string;
      shortDescription: string;
      level: "Beginner" | "Intermediate" | "Advanced";
      duration: string;
      skills: string[];
      category: string;
      pricing: { amount: number; currency?: "INR" | "USD"; discountPercent?: number };
      isPublished: boolean;
      thumbnailUrl: string | null;
      previewVideoUrl: string | null;
    }>,
  ): Promise<{ courseId: string }> => {
    const { data } = await api.patch<ApiEnvelope<{ courseId: string }>>(
      `/mentor/courses/${courseId}`,
      body,
    );
    return data.data;
  },

  addModule: async (
    courseId: string,
    body: {
      title: string;
      description?: string;
      contentType: "video" | "pdf" | "notes" | "link";
      duration?: string;
      isFree?: boolean;
      order?: number;
    },
  ): Promise<{ moduleId: string }> => {
    const { data } = await api.post<ApiEnvelope<{ moduleId: string }>>(
      `/mentor/courses/${courseId}/modules`,
      body,
    );
    return data.data;
  },

  updateModule: async (
    courseId: string,
    moduleId: string,
    body: Partial<{
      title: string;
      description: string;
      contentType: "video" | "pdf" | "notes" | "link";
      duration: string;
      isFree: boolean;
      order: number;
      contentUrl: string | null;
    }>,
  ): Promise<{ moduleId: string }> => {
    const { data } = await api.patch<ApiEnvelope<{ moduleId: string }>>(
      `/mentor/courses/${courseId}/modules/${moduleId}`,
      body,
    );
    return data.data;
  },

  uploadModuleFile: async (
    courseId: string,
    moduleId: string,
    file: File,
  ): Promise<{ url: string; moduleId: string }> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<
      ApiEnvelope<{ url: string; moduleId: string }>
    >(`/mentor/courses/${courseId}/modules/${moduleId}/content`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  listStudents: async (
    courseId: string,
  ): Promise<{ courseTitle: string; students: EnrolledStudentRow[] }> => {
    const { data } = await api.get<
      ApiEnvelope<{ courseTitle: string; students: EnrolledStudentRow[] }>
    >(`/mentor/courses/${courseId}/students`);
    return data.data;
  },
};
