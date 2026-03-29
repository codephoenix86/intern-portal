import api from "@/lib/axios";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface StudentProfile {
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  bio: string | null;
  role: string;
  college: string | null;
  branch: string | null;
  location: string | null;
  cgpa: string | null;
  semester: string | null;
  experienceSummary: string | null;
  profileCompletion: number;
  studentSkills: string[];
  studentProjects: string[];
  achievements: string[];
  codingProfiles: {
    leetcode: string | null;
    codechef: string | null;
    codeforces: string | null;
    github: string | null;
    linkedin: string | null;
    portfolio: string | null;
  };
  resumeUrl: string | null;
  parsedResume: Record<string, unknown> | null;
  updatedAt: string;
}

export interface StudentDashboardStats {
  student: {
    applicationsSubmitted: number;
    interviewsScheduled: number;
    profileViews: number;
    matchScore: number;
  };
}

export type StudentApplicationStatus =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Rejected";

export interface StudentApplication {
  id: string;
  internship: string;
  company: string;
  status: StudentApplicationStatus;
  date: string;
  matchScore: number;
}

export interface UpdateStudentProfilePayload {
  name?: string;
  phone?: string | null;
  avatar?: string | null;
  bio?: string | null;
  college?: string | null;
  branch?: string | null;
  location?: string | null;
  cgpa?: string | null;
  semester?: string | null;
  experienceSummary?: string | null;
  studentSkills?: string[];
  studentProjects?: string[];
  achievements?: string[];
  codingProfiles?: {
    leetcode?: string | null;
    codechef?: string | null;
    codeforces?: string | null;
    github?: string | null;
    linkedin?: string | null;
    portfolio?: string | null;
  };
}

export interface ResumeUploadResult {
  url: string;
  parsedResume: Record<string, unknown> | null;
}

interface StudentApplicationsResponse {
  applications: StudentApplication[];
}

export const studentProfileService = {
  getProfile: async (): Promise<StudentProfile> => {
    const { data } = await api.get<ApiEnvelope<StudentProfile>>("/student/profile");
    return data.data;
  },

  updateProfile: async (
    payload: UpdateStudentProfilePayload,
  ): Promise<StudentProfile> => {
    const { data } = await api.patch<ApiEnvelope<StudentProfile>>(
      "/student/profile",
      payload,
    );
    return data.data;
  },

  uploadResume: async (file: File): Promise<ResumeUploadResult> => {
    const formData = new FormData();
    formData.append("resume", file);

    const { data } = await api.post<ApiEnvelope<ResumeUploadResult>>(
      "/student/resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data.data;
  },

  getDashboardStats: async (): Promise<StudentDashboardStats> => {
    const { data } = await api.get<ApiEnvelope<StudentDashboardStats>>(
      "/student/dashboard",
    );
    return data.data;
  },

  getApplications: async (): Promise<StudentApplication[]> => {
    const { data } = await api.get<ApiEnvelope<StudentApplicationsResponse>>(
      "/student/applications",
    );
    return data.data.applications;
  },
};
