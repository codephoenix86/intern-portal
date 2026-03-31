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
  type: "concept" | "code" | "debug" | "scenario";
}

export interface StudentRoadmapTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export interface StudentRoadmapSummary {
  total: number;
  completed: number;
  remaining: number;
  nextTask: string | null;
}

export interface StudentRoadmapData {
  availableFields: string[];
  selectedFields: string[];
  tasks: StudentRoadmapTask[];
  summary: StudentRoadmapSummary;
}

export interface StudentCourse {
  id: number;
  title: string;
  provider: string;
  duration: string;
  level: string;
  url: string;
  tags?: string[];
}

interface StudentJobsResponse {
  jobs: StudentJobCard[];
}

interface StudentJobDetailResponse {
  job: StudentJobCard;
}

interface StudentApplicationsResponse {
  applications: StudentApplication[];
}

interface StudentQuizResponse {
  questions: StudentQuizQuestion[];
}

interface StudentRoadmapResponse {
  availableFields: string[];
  selectedFields: string[];
  tasks: StudentRoadmapTask[];
  summary: StudentRoadmapSummary;
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

  getJobById: async (jobId: string): Promise<StudentJobCard> => {
    const { data } = await api.get<ApiEnvelope<StudentJobDetailResponse>>(
      `/student/jobs/${jobId}`,
    );
    return data.data.job;
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

  getQuiz: async (params: {
    skill: string;
    count: number;
  }): Promise<StudentQuizQuestion[]> => {
    const { data } = await api.get<ApiEnvelope<StudentQuizResponse>>(
      "/student/content/quiz",
      {
        params: {
          skill: params.skill,
          count: params.count,
        },
      },
    );
    return data.data.questions;
  },

  getRoadmap: async (fields?: string[]): Promise<StudentRoadmapData> => {
    const { data } = await api.get<ApiEnvelope<StudentRoadmapResponse>>(
      "/student/content/roadmap",
      {
        params: {
          fields: fields && fields.length > 0 ? fields.join(",") : undefined,
        },
      },
    );
    return data.data;
  },

  toggleRoadmapTask: async (taskId: string): Promise<StudentRoadmapData> => {
    const { data } = await api.patch<ApiEnvelope<StudentRoadmapResponse>>(
      `/student/content/roadmap/tasks/${taskId}`,
      {},
    );
    return data.data;
  },

  getCourses: async (fields?: string[]): Promise<StudentCourse[]> => {
    const { data } = await api.get<ApiEnvelope<StudentCoursesResponse>>(
      "/student/content/courses",
      {
        params: {
          fields: fields && fields.length > 0 ? fields.join(",") : undefined,
        },
      },
    );
    return data.data.courses;
  },
};
