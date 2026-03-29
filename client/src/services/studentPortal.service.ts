import api from "@/lib/axios";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface StudentJobCard {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  skills: string[];
  description?: string;
  requirements?: string[];
  postedDate: string;
  applicants: number;
  matchScore: number;
}

export interface StudentApplication {
  id: string;
  internship: string;
  company: string;
  status: "Applied" | "Screening" | "Interview" | "Offer" | "Rejected";
  date: string;
  matchScore: number;
}

export interface StudentQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export interface StudentRoadmapTask {
  id: number;
  title: string;
  category: string;
  completed: boolean;
}

export interface StudentCourse {
  id: number;
  title: string;
  provider: string;
  duration: string;
  level: string;
  url: string;
}

interface StudentJobsResponse {
  jobs: StudentJobCard[];
}

interface StudentApplicationsResponse {
  applications: StudentApplication[];
}

interface StudentQuizResponse {
  questions: StudentQuizQuestion[];
}

interface StudentRoadmapResponse {
  tasks: StudentRoadmapTask[];
}

interface StudentCoursesResponse {
  courses: StudentCourse[];
}

export const studentPortalService = {
  getJobs: async (filters?: {
    keyword?: string;
    location?: string;
    skills?: string[];
    sort?: "newest" | "match";
  }): Promise<StudentJobCard[]> => {
    const { data } = await api.get<ApiEnvelope<StudentJobsResponse>>(
      "/student/jobs",
      {
        params: {
          keyword: filters?.keyword,
          location: filters?.location,
          skills: filters?.skills?.join(","),
          sort: filters?.sort,
        },
      },
    );

    return data.data.jobs;
  },

  getRecommendedJobs: async (): Promise<StudentJobCard[]> => {
    const { data } = await api.get<ApiEnvelope<StudentJobsResponse>>(
      "/student/jobs/recommended",
    );
    return data.data.jobs;
  },

  applyToJob: async (jobId: string): Promise<{ applicationId: string }> => {
    const { data } = await api.post<ApiEnvelope<{ applicationId: string }>>(
      `/student/jobs/${jobId}/apply`,
    );
    return data.data;
  },

  getApplications: async (): Promise<StudentApplication[]> => {
    const { data } = await api.get<ApiEnvelope<StudentApplicationsResponse>>(
      "/student/applications",
    );
    return data.data.applications;
  },

  getQuiz: async (): Promise<StudentQuizQuestion[]> => {
    const { data } = await api.get<ApiEnvelope<StudentQuizResponse>>(
      "/student/content/quiz",
    );
    return data.data.questions;
  },

  getRoadmap: async (): Promise<StudentRoadmapTask[]> => {
    const { data } = await api.get<ApiEnvelope<StudentRoadmapResponse>>(
      "/student/content/roadmap",
    );
    return data.data.tasks;
  },

  toggleRoadmapTask: async (taskId: number | string): Promise<StudentRoadmapTask[]> => {
    const { data } = await api.patch<ApiEnvelope<StudentRoadmapResponse>>(
      `/student/content/roadmap/tasks/${taskId}`,
      {},
    );
    return data.data.tasks;
  },

  getCourses: async (): Promise<StudentCourse[]> => {
    const { data } = await api.get<ApiEnvelope<StudentCoursesResponse>>(
      "/student/content/courses",
    );
    return data.data.courses;
  },
};
