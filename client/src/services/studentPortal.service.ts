import api from "@/lib/axios";

type ApiEnvelope<T> = { success: boolean; message: string; data: T };

async function unwrap<T>(p: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const { data } = await p;
  return data.data;
}

export interface JobCard {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  skills: string[];
  description: string;
  requirements: string[];
  postedDate: string;
  applicants: number;
  matchScore: number;
}

export interface StudentDashboardData {
  student: {
    applicationsSubmitted: number;
    interviewsScheduled: number;
    profileViews: number;
    matchScore: number;
  };
}

export interface StudentApplicationRow {
  id: string;
  internship: string;
  company: string;
  status: string;
  date: string;
  matchScore: number;
}

export interface StudentProfile {
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  profileCompletion: number;
  studentSkills: string[];
  resumeUrl: string | null;
  parsedResume: Record<string, unknown> | null;
}

export interface QuizQuestion {
  id?: number;
  question: string;
  options: string[];
  correct: number;
}

export interface RoadmapTask {
  id: number;
  title: string;
  category: string;
  completed: boolean;
}

export interface RecommendedCourse {
  id: number;
  title: string;
  provider: string;
  duration: string;
  level: string;
  url?: string;
}

export interface StudentNotification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: "success" | "info";
}

export interface NotificationsPageData {
  notifications: StudentNotification[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

export interface JobListQuery {
  keyword?: string;
  location?: string;
  skills?: string;
  sort?: "newest" | "match";
}

function jobQueryParams(q: JobListQuery): string {
  const p = new URLSearchParams();
  if (q.keyword) p.set("keyword", q.keyword);
  if (q.location) p.set("location", q.location);
  if (q.skills) p.set("skills", q.skills);
  if (q.sort) p.set("sort", q.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const getStudentDashboard = () =>
  unwrap<StudentDashboardData>(api.get("/student/dashboard"));

export const listStudentJobs = (query: JobListQuery = {}) =>
  unwrap<{ jobs: JobCard[] }>(
    api.get(`/student/jobs${jobQueryParams(query)}`),
  );

export const listRecommendedJobs = () =>
  unwrap<{ jobs: JobCard[] }>(api.get("/student/jobs/recommended"));

export const getStudentJob = (jobId: string) =>
  unwrap<{ job: JobCard }>(api.get(`/student/jobs/${jobId}`));

export const getStudentJobMatchScore = (jobId: string) =>
  unwrap<{ score: number }>(api.get(`/student/jobs/${jobId}/match-score`));

export const applyToStudentJob = (jobId: string) =>
  unwrap<{ applicationId: string }>(
    api.post(`/student/jobs/${jobId}/apply`),
  );

export const listStudentApplications = () =>
  unwrap<{ applications: StudentApplicationRow[] }>(
    api.get("/student/applications"),
  );

export const getStudentProfile = () =>
  unwrap<StudentProfile>(api.get("/student/profile"));

export const patchStudentProfile = (body: {
  name?: string;
  phone?: string | null;
  studentSkills?: string[];
}) => unwrap<StudentProfile>(api.patch("/student/profile", body));

export const uploadStudentResume = (file: File) => {
  const form = new FormData();
  form.append("resume", file);
  return unwrap<{ url: string; parsedResume: Record<string, unknown> | null }>(
    api.post("/student/resume", form),
  );
};

export const getStudentQuiz = () =>
  unwrap<{ questions: QuizQuestion[] }>(api.get("/student/content/quiz"));

export const getStudentRoadmap = () =>
  unwrap<{ tasks: RoadmapTask[] }>(api.get("/student/content/roadmap"));

export const toggleRoadmapTask = (taskId: string | number) =>
  unwrap<{ tasks: RoadmapTask[] }>(
    api.patch(`/student/content/roadmap/tasks/${taskId}`, {}),
  );

export const getStudentCourses = () =>
  unwrap<{ courses: RecommendedCourse[] }>(
    api.get("/student/content/courses"),
  );

export const listStudentNotifications = (page = 1, limit = 20) =>
  unwrap<NotificationsPageData>(
    api.get(`/student/notifications?page=${page}&limit=${limit}`),
  );

export const markStudentNotificationRead = (id: string) =>
  unwrap<unknown>(api.patch(`/student/notifications/${id}/read`));

export const markAllStudentNotificationsRead = () =>
  unwrap<unknown>(api.post("/student/notifications/read-all"));
